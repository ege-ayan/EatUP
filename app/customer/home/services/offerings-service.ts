import axios from "axios";
import { Prisma } from "@/lib/generated/prisma";

type Offering = Prisma.OfferingGetPayload<{
  include: {
    category: true;
    organization: true;
  };
}>;

type OfferingsResult = {
  offerings: Offering[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
};

type CategoriesResult = {
  categories: Prisma.CategoryGetPayload<Record<string, never>>[];
};

export type { Offering, OfferingsResult, CategoriesResult };

export const offeringsService = {
  async getOfferings(
    categoryId?: string,
    organizationId?: string,
    limit = 20,
    offset = 0
  ): Promise<OfferingsResult> {
    const params = new URLSearchParams();
    if (categoryId) params.append("categoryId", categoryId);
    if (organizationId) params.append("organizationId", organizationId);
    params.append("limit", limit.toString());
    params.append("offset", offset.toString());

    const response = await axios.get<OfferingsResult>(
      `/api/offerings?${params.toString()}`
    );
    return response.data;
  },

  async getCategories(): Promise<CategoriesResult> {
    const response = await axios.get<CategoriesResult>("/api/categories");
    return response.data;
  },
};
