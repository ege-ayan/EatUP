import { prisma } from "./prisma";
import { Prisma } from "@/generated/prisma";

export type Organization = Prisma.OrganizationGetPayload<{
  include: {
    users: {
      select: {
        id: true;
        name: true;
        surname: true;
        email: true;
      };
    };
  };
}>;

export interface OrganizationsFilter {
  search?: string;
}

export interface CreateOrganizationData {
  name: string;
  location: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface UpdateOrganizationData {
  name?: string;
  location?: string;
  description?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
}

export async function getOrganizations(
  filter: OrganizationsFilter = {}
): Promise<Organization[]> {
  const { search } = filter;

  const where: Prisma.OrganizationWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const organizations = await prisma.organization.findMany({
    where,
    include: {
      users: {
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return organizations;
}

export async function getOrganizationById(
  id: string
): Promise<Organization | null> {
  const organization = await prisma.organization.findUnique({
    where: { id },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
        },
      },
    },
  });

  return organization;
}

export async function createOrganization(
  data: CreateOrganizationData
): Promise<Organization> {
  const organization = await prisma.organization.create({
    data: {
      name: data.name,
      location: data.location,
      description: data.description || null,
      phone: data.phone || null,
      email: data.email || null,
      website: data.website || null,
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
        },
      },
    },
  });

  return organization;
}

export async function updateOrganization(
  id: string,
  data: UpdateOrganizationData
): Promise<Organization> {
  const organization = await prisma.organization.findUnique({
    where: { id },
  });

  if (!organization) {
    throw new Error("Organizasyon bulunamadı");
  }

  const updatedOrganization = await prisma.organization.update({
    where: { id },
    data,
    include: {
      users: {
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
        },
      },
    },
  });

  return updatedOrganization;
}

export async function deleteOrganization(id: string): Promise<void> {
  const organization = await prisma.organization.findUnique({
    where: { id },
    include: {
      users: true,
    },
  });

  if (!organization) {
    throw new Error("Organizasyon bulunamadı");
  }

  if (organization.users.length > 0) {
    throw new Error("Kullanıcısı olan organizasyonlar silinemez");
  }

  await prisma.organization.delete({
    where: { id },
  });
}

export async function getOrganizationsCount(): Promise<number> {
  return prisma.organization.count();
}

export async function getOrganizationsWithUsers(): Promise<number> {
  return prisma.organization.count({
    where: {
      users: {
        some: {},
      },
    },
  });
}

export async function getAvailableOrganizations(): Promise<
  Array<{ id: string; name: string; location: string }>
> {
  const organizations = await prisma.organization.findMany({
    select: {
      id: true,
      name: true,
      location: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return organizations;
}
