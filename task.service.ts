import prisma from "../prisma/client";

export const getTasksService = async (userId: string, query: any) => {
  const { page = 1, status, search } = query;

  return prisma.task.findMany({
    where: {
      userId,
      ...(status && { status: status === "true" }),
      ...(search && { title: { contains: search } }),
    },
    skip: (page - 1) * 10,
    take: 10,
  });
};

export const createTaskService = (userId: string, data: any) => {
  return prisma.task.create({
    data: { ...data, userId },
  });
};