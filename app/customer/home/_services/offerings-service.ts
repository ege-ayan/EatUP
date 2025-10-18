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

export type { Offering, OfferingsResult };

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
};
