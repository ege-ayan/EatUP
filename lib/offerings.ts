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
      category: true,
      organization: true,
    },
    orderBy: [{ createdAt: "desc" }, { name: "asc" }],
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
