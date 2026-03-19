import prisma from "../prisma/client";
import bcrypt from "bcrypt";

export const createUser = async (email: string, password: string) => {
  const hashed = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: { email, password: hashed },
  });
};

export const validateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return null;

  return user;
};