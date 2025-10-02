import { prisma } from "./prisma";

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Offering {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  isAvailable: boolean;
  organizationId: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    description?: string;
  };
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
  categories: Category[];
  error?: string;
}

export interface OfferingsFilter {
  categoryId?: string;
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
  categories: Category[];
}

export async function getOfferings(
  filter: OfferingsFilter = {},
  pagination: PaginationOptions = {}
): Promise<OfferingsResult> {
  const { categoryId, organizationId } = filter;
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

  const offerings = await prisma.offering.findMany({
    where,
    include: {
      category: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
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
      price: offering.price,
      originalPrice: offering.originalPrice || undefined,
      stock: offering.stock,
      isAvailable: offering.isAvailable,
      organizationId: offering.organizationId,
      categoryId: offering.categoryId,
      category: {
        id: offering.category.id,
        name: offering.category.name,
        description: offering.category.description || undefined,
      },
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
 * Get all active categories
 */
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
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description || undefined,
      isActive: category.isActive,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    })),
  };
}
