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
  async getOrganizationOfferings(
    organizationId: string
  ): Promise<OfferingsResult> {
    const response = await axios.get<OfferingsResult>(
      `/api/offerings/organization/${organizationId}`
    );
    return response.data;
  },

  async deleteOffering(
    id: string
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    const response = await axios.delete(`/api/offerings?id=${id}`);
    return response.data;
  },
};
