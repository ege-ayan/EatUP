import { prisma } from "./prisma";
import { Prisma, UserRole } from "@/generated/prisma";
import * as bcrypt from "bcrypt";

export type User = Prisma.UserGetPayload<{
  include: {
    organization: true;
  };
}>;

export interface UsersFilter {
  search?: string;
  role?: UserRole | "ALL";
}

export interface CreateUserData {
  name: string;
  surname: string;
  email: string;
  password: string;
  role: UserRole;
  organizationId?: string;
}

export interface UpdateUserData {
  name?: string;
  surname?: string;
  email?: string;
  organizationId?: string | null;
}

export async function getUsers(filter: UsersFilter = {}): Promise<User[]> {
  const { search, role } = filter;

  const where: Prisma.UserWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { surname: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  if (role && role !== "ALL") {
    where.role = role as UserRole;
  }

  const users = await prisma.user.findMany({
    where,
    include: {
      organization: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
}

export async function getUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      organization: true,
    },
  });

  return user;
}

export async function createUser(data: CreateUserData): Promise<User> {
  const { password, organizationId, ...userData } = data;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Bu e-posta adresi zaten kullanımda");
  }

  // Validate organization for ORGANIZATION role
  if (data.role === UserRole.ORGANIZATION) {
    if (!organizationId) {
      throw new Error("Organizasyon kullanıcısı için organizasyon seçilmelidir");
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new Error("Seçilen organizasyon bulunamadı");
    }
  }

  const user = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
      organizationId: data.role === UserRole.ORGANIZATION ? organizationId : null,
    },
    include: {
      organization: true,
    },
  });

  return user;
}

export async function updateUser(
  id: string,
  data: UpdateUserData
): Promise<User> {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { organization: true },
  });

  if (!user) {
    throw new Error("Kullanıcı bulunamadı");
  }

  // If email is being changed, check if it's already in use
  if (data.email && data.email !== user.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("Bu e-posta adresi zaten kullanımda");
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data,
    include: {
      organization: true,
    },
  });

  return updatedUser;
}

export async function deleteUser(id: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("Kullanıcı bulunamadı");
  }

  if (user.role === UserRole.ADMIN) {
    throw new Error("Yönetici kullanıcıları silinemez");
  }

  await prisma.user.delete({
    where: { id },
  });
}

export async function getUsersCount(): Promise<number> {
  return prisma.user.count();
}

export async function getUsersByRole(role: UserRole): Promise<number> {
  return prisma.user.count({
    where: { role },
  });
}
