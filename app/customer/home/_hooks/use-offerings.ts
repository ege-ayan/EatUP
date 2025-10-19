import { useInfiniteQuery } from "@tanstack/react-query";
import {
  offeringsService,
  OfferingsResult,
} from "../_services/offerings-service";

export const useOfferings = (
  categoryId?: string,
  organizationId?: string,
  search?: string,
  sortBy?: string,
  sortOrder?: string,
  limit = 21
) => {
  return useInfiniteQuery<OfferingsResult>({
    queryKey: [
      "offerings",
      categoryId,
      organizationId,
      search,
      sortBy,
      sortOrder,
      limit,
    ],
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      offeringsService.getOfferings(
        categoryId,
        organizationId,
        search,
        sortBy,
        sortOrder,
        limit,
        pageParam as number
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.offset + lastPage.pagination.limit;
      }
      return undefined;
    },
  });
};
