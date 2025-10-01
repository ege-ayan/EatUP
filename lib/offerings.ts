import { prisma } from "./prisma";

export interface Offering {
  id: string;
  name: string;
  description?: string;
  image?: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  isAvailable: boolean;
  organizationId: string;
  organization: {
    id: string;
    name: string;
    locationName: string;
    category: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OfferingsResponse {
  success: boolean;
  offerings: Offering[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  error?: string;
}

export interface CategoriesResponse {
  success: boolean;
  categories: string[];
  error?: string;
}

export interface OfferingsFilter {
  category?: string;
  organizationId?: string;
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
  categories: string[];
}

export async function getOfferings(
  filter: OfferingsFilter = {},
  pagination: PaginationOptions = {}
): Promise<OfferingsResult> {
  const { category, organizationId } = filter;
  const { limit = 20, offset = 0 } = pagination;

  const where: Record<string, unknown> = {
    isAvailable: true,
    stock: { gt: 0 },
  };

  if (category) {
    where.category = category;
  }

  if (organizationId) {
    where.organizationId = organizationId;
  }

  const offerings = await prisma.offering.findMany({
    where,
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          locationName: true,
          category: true,
          image: true,
        },
      },
    },
    orderBy: [{ createdAt: "desc" }, { name: "asc" }],
    take: limit,
    skip: offset,
  });

  const totalCount = await prisma.offering.count({ where });

  return {
    offerings: offerings.map((offering) => ({
      id: offering.id,
      name: offering.name,
      description: offering.description || undefined,
      image: offering.image || undefined,
      category: offering.category,
      price: offering.price,
      originalPrice: offering.originalPrice || undefined,
      stock: offering.stock,
      isAvailable: offering.isAvailable,
      organizationId: offering.organizationId,
      organization: {
        id: offering.organization.id,
        name: offering.organization.name,
        locationName: offering.organization.locationName,
        category: offering.organization.category,
        image: offering.organization.image || undefined,
      },
      createdAt: offering.createdAt.toISOString(),
      updatedAt: offering.updatedAt.toISOString(),
    })),
    pagination: {
      total: totalCount,
      limit,
      offset,
      hasMore: offset + limit < totalCount,
    },
  };
}

/**
 * Get all unique categories from available offerings
 */
export async function getCategories(): Promise<CategoriesResult> {
  const categories = await prisma.offering.findMany({
    where: {
      isAvailable: true,
      stock: { gt: 0 },
    },
    select: {
      category: true,
    },
    distinct: ["category"],
    orderBy: {
      category: "asc",
    },
  });

  const uniqueCategories = Array.from(
    new Set(categories.map((item) => item.category))
  );

  return {
    categories: uniqueCategories,
  };
}
