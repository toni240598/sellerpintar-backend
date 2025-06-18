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
    console.log(project);

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
            assigneeId: userId,
        },
    });
};

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
