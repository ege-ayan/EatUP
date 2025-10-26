import { prisma } from "./prisma";
import { Prisma } from "@/generated/prisma";

type Category = Prisma.CategoryGetPayload<Record<string, never>>;
type Offering = Prisma.OfferingGetPayload<{
  include: {
    category: true;
    organization: true;
  };
}>;

export interface OfferingsFilter {
  categoryId?: string;
  organizationId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export interface OfferingsResult {
  offerings: Offering[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface CategoriesResult {
  categories: Category[];
}

export async function getOfferings(
  filter: OfferingsFilter = {},
  pagination: PaginationOptions = {}
): Promise<OfferingsResult> {
  const {
    categoryId,
    organizationId,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = filter;
  const { limit = 20, offset = 0 } = pagination;

  const where: Record<string, unknown> = {
    isAvailable: true,
    stock: { gt: 0 },
  };

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (organizationId) {
    where.organizationId = organizationId;
  }

  // Add search functionality
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { category: { name: { contains: search, mode: "insensitive" } } },
      { organization: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  // Build orderBy object
  const orderBy: Record<string, "asc" | "desc">[] = [];

  if (sortBy === "expirationDate") {
    orderBy.push({ expirationDate: sortOrder as "asc" | "desc" });
  } else if (sortBy === "price") {
    orderBy.push({ price: sortOrder as "asc" | "desc" });
  } else if (sortBy === "name") {
    orderBy.push({ name: sortOrder as "asc" | "desc" });
  } else {
    // Default to createdAt
    orderBy.push({ createdAt: sortOrder as "asc" | "desc" });
  }

  // Fallback sorting
  if (sortBy !== "name") {
    orderBy.push({ name: "asc" });
  }

  const offerings = await prisma.offering.findMany({
    where,
    include: {
      category: true,
      organization: true,
    },
    orderBy,
    take: limit,
    skip: offset,
  });

  const totalCount = await prisma.offering.count({ where });

  return {
    offerings,
    pagination: {
      total: totalCount,
      limit,
      offset,
      hasMore: offset + limit < totalCount,
    },
  };
}

export async function getCategories(): Promise<CategoriesResult> {
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return {
    categories,
  };
}

export async function getOfferingById(id: string): Promise<Offering | null> {
  const offering = await prisma.offering.findUnique({
    where: { id },
    include: {
      category: true,
      organization: true,
    },
  });

  return offering;
}

export interface UpdateOfferingData {
  name?: string;
  description?: string | null;
  price?: number;
  originalPrice?: number | null;
  stock?: number;
  maxReservationPerCustomer?: number;
  bookingDuration?: number;
  expirationDate?: Date;
  categoryId?: string;
  image?: string | null;
  isAvailable?: boolean;
}

export async function updateOffering(
  id: string,
  data: UpdateOfferingData
): Promise<Offering> {
  const offering = await prisma.offering.update({
    where: { id },
    data: {
      ...data,
      isAvailable: data.stock !== undefined ? data.stock > 0 : undefined,
    },
    include: {
      category: true,
      organization: true,
    },
  });

  return offering;
}
