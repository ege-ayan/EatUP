import axios from "axios";
import type {
  Offering,
  OfferingsResponse,
  CategoriesResponse,
} from "@/lib/offerings";

export type { Offering, OfferingsResponse, CategoriesResponse };

export const offeringsService = {
  async getOfferings(
    category?: string,
    organizationId?: string,
    limit = 20,
    offset = 0
  ): Promise<OfferingsResponse> {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (organizationId) params.append("organizationId", organizationId);
    params.append("limit", limit.toString());
    params.append("offset", offset.toString());

    const response = await axios.get<OfferingsResponse>(
      `/api/offerings?${params.toString()}`
    );
    return response.data;
  },

  async getCategories(): Promise<CategoriesResponse> {
    const response = await axios.get<CategoriesResponse>(
      "/api/offerings/categories"
    );
    return response.data;
  },
};
