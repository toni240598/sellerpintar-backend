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

  return [...ownedProjects, ...projectsFromMembership];
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
  const memberships = await prisma.membership.findMany({
    where: { projectId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  const members = memberships.map((m) => m.user);

  return { project, members };
};
