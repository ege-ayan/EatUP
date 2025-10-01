import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  offeringsService,
  OfferingsResponse,
  CategoriesResponse,
} from "../services/offerings-service";

export const useOfferings = (
  category?: string,
  organizationId?: string,
  limit = 20
) => {
  return useInfiniteQuery<OfferingsResponse>({
    queryKey: ["offerings", category, organizationId, limit],
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      offeringsService.getOfferings(
        category,
        organizationId,
        limit,
        pageParam as number
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.offset + lastPage.pagination.limit;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCategories = () => {
  return useQuery<CategoriesResponse>({
    queryKey: ["categories"],
    queryFn: () => offeringsService.getCategories(),
    staleTime: 1000 * 60 * 30,
  });
};
