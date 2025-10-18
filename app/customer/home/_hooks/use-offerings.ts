import { useInfiniteQuery } from "@tanstack/react-query";
import {
  offeringsService,
  OfferingsResult,
} from "../_services/offerings-service";

export const useOfferings = (
  categoryId?: string,
  organizationId?: string,
  limit = 20
) => {
  return useInfiniteQuery<OfferingsResult>({
    queryKey: ["offerings", categoryId, organizationId, limit],
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      offeringsService.getOfferings(
        categoryId,
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
  });
};
