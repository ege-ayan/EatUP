import axios from "axios";
import type {
  Offering,
  OfferingsResponse,
  CategoriesResponse,
} from "@/lib/offerings";

export type { Offering, OfferingsResponse, CategoriesResponse };

export const offeringsService = {
  async getOrganizationOfferings(
    organizationId: string
  ): Promise<OfferingsResponse> {
    const response = await axios.get<OfferingsResponse>(
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
