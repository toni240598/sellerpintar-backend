import prisma from "../utils/prisma.js";

export const createProject = async (ownerId, name) => {
  const project = await prisma.project.create({
    data: {
      name,
      ownerId,
    },
  });
  return project;
};

export const updateProject = async (projectId, userId, name) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  })

  if (!project) {
    const err = new Error('Project tidak ditemukan')
    err.statusCode = 404
    throw err
  }

  if (project.ownerId !== userId) {
    const err = new Error('Kamu tidak memiliki izin untuk mengedit project ini')
    err.statusCode = 403
    throw err
  }

  return await prisma.project.update({
    where: { id: projectId },
    data: { name },
  })
}

export const inviteMemberToProject = async (projectId, emailToInvite, inviterId) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project || project.ownerId !== inviterId) {
    throw new Error("Kamu bukan owner project ini");
  }

  const user = await prisma.user.findUnique({ where: { email: emailToInvite } });
  if (!user) throw new Error("User dengan email tersebut tidak ditemukan");
  if (user.id === inviterId) throw new Error("Owner tidak bisa meng-invite dirinya sendiri");

  const existing = await prisma.membership.findFirst({
    where: { userId: user.id, projectId },
  });

  if (existing) throw new Error("User sudah menjadi member project ini");

  return await prisma.membership.create({
    data: { userId: user.id, projectId },
  });
};


export const getAllUserProjects = async (userId) => {
  // Get projects where user is member
  const memberProjects = await prisma.membership.findMany({
    where: { userId },
    include: {
      project: {
        include: { owner: { select: { id: true, email: true } } },
      },
    },
  });

  const ownedProjects = await prisma.project.findMany({
    where: { ownerId: userId },
    include: { owner: { select: { id: true, email: true } } },
  });

  const projectsFromMembership = memberProjects.map((m) => m.project);
  const allProjects = [...ownedProjects, ...projectsFromMembership].sort((a, b) =>
    a.name.localeCompare(b.name)
  )
  return allProjects
};

export const deleteProject = async (projectId, userId) => {
  // Pastikan project dimiliki oleh user tersebut
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) throw new Error("Project tidak ditemukan");
  if (project.ownerId !== userId) {
    throw new Error("Kamu bukan owner project ini");
  }

  // Hapus semua memberships terkait project
  await prisma.membership.deleteMany({
    where: { projectId },
  });

  // Hapus project
  await prisma.project.delete({
    where: { id: projectId },
  });

  return { message: "Project berhasil dihapus" };
};

export const getProjectDetailWithMembers = async (projectId, userId) => {
  // Ambil project
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: { select: { id: true, email: true } },
    },
  });

  if (!project) throw new Error("Project tidak ditemukan");

  // Cek apakah requester adalah owner atau member
  const isOwner = project.ownerId === userId;
  const isMember = await prisma.membership.findFirst({
    where: { projectId, userId },
  });

  if (!isOwner && !isMember) {
    throw new Error("Kamu tidak punya akses ke project ini");
  }

  // Ambil member list
  const [users, memberships] = await Promise.all([
    prisma.user.findMany({
      where: {
        id: {
          not: userId, // Mengecualikan userId tertentu
        },
      },
      select: {
        id: true,
        email: true,
      },
      orderBy: {
        email: 'asc',
      },
    }),
    prisma.membership.findMany({
      where: { projectId },
      select: {
        userId: true,
      },
    }),
  ]);
  const memberIds = new Set(memberships.map((m) => m.userId));
  const usersWithMembershipStatus = users.map((user) => ({
    ...user,
    isMember: memberIds.has(user.id),
  }));

  return { project, members: usersWithMembershipStatus };
};
