import prisma from "../utils/prisma.js";

/** Cek apakah user adalah owner atau member project */
const checkUserAccessToProject = async (userId, projectId) => {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new Error("Project tidak ditemukan");

    if (project.ownerId === userId) return { isOwner: true };

    const isMember = await prisma.membership.findFirst({
        where: { userId, projectId },
    });

    if (isMember) return { isOwner: false };

    throw new Error("Kamu tidak punya akses ke project ini");
};

export const getTasksByProjectId = async (userId, projectId) => {
    const project = await prisma.project.findUnique({
        where: { id: projectId },
    });

    if (!project) throw new Error("Project tidak ditemukan");

    const { isOwner } = await checkUserAccessToProject(userId, projectId);

    // Ambil daftar task
    const rawTasks = await prisma.task.findMany({
        where: { projectId },
        include: {
            assignee: {
                select: {
                    id: true,
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    const tasks = rawTasks.map((task) => ({
        ...task,
        assigneeEmail: task.assignee?.email || null,
    }))
    return tasks;
};

/** ✅ Buat task */
export const createTask = async (userId, data) => {
    const { isOwner } = await checkUserAccessToProject(userId, data.projectId);

    return await prisma.task.create({
        data: {
            title: data.title,
            description: data.description,
            projectId: data.projectId,
            assigneeId: data.assigneeId || null,
        },
    });
};

/** ✅ Update status atau assignee */
export const updateTaskStatusOrAssignee = async (userId, taskId, status) => {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new Error("Task tidak ditemukan");

    await checkUserAccessToProject(userId, task.projectId);

    return await prisma.task.update({
        where: { id: taskId },
        data: {
            status: status,
            assigneeId:  status == 'todo' ? null : userId,
        },
    });
};

export const updateAssigneeTask = async (userId, taskId) => {
    // await prisma.task.update({ where: { id: taskId }, data: { assigneeId: userId } });
    const user = await prisma.user.findUnique({where: {id: userId}});
    return user; 
}

/** ✅ Update title dan description (owner only) */
export const updateTaskContent = async (userId, taskId, payload) => {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new Error("Task tidak ditemukan");

    const { isOwner } = await checkUserAccessToProject(userId, task.projectId);
    if (!isOwner) throw new Error("Hanya owner yang bisa update konten task");

    return await prisma.task.update({
        where: { id: taskId },
        data: {
            title: payload.title,
            description: payload.description,
        },
    });
};


export const getTaskStatsByUser = async (userId) => {
  // Get all project IDs where user is owner or member
  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { memberships: { some: { userId } } }
      ]
    },
    select: { id: true }
  })
  
  const projectIds = projects.map(p => p.id)

  if (projectIds.length === 0) {
    return {
      tasks: { total: 0, todo: 0, in_progress: 0, done: 0 },
      projects: { total: 0, active: 0, completed: 0, archived: 0 }
    }
  }

  // Task statistics
  const taskStats = await prisma.task.groupBy({
    by: ['status'],
    where: {
      projectId: { in: projectIds }
    },
    _count: {
      status: true
    }
  })

  // Project statistics
  const projectStats = await prisma.project.groupBy({
    by: ['ownerId'],
    where: {
      id: { in: projectIds }
    },
    _count: {
      _all: true
    }
  })

  // Transform task stats
  const tasks = {
    total: taskStats.reduce((sum, item) => sum + item._count.status, 0),
    todo: taskStats.find(item => item.status === 'todo')?._count.status || 0,
    in_progress: taskStats.find(item => item.status === 'in_progress')?._count.status || 0,
    done: taskStats.find(item => item.status === 'done')?._count.status || 0
  }

  // For projects, we need a better way to determine status
  // Currently just showing counts - you should add status field to Project model
  const projectsCount = projectStats.reduce((sum, item) => sum + item._count._all, 0)

  return {
    tasks,
    projects: {
      total: projectsCount,
      active: projectsCount, // Replace with actual logic when you have project status
      completed: 0,
      archived: 0
    }
  }
}
