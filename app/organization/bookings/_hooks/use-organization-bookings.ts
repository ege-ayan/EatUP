import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { organizationBookingsService } from "../_services/bookings-service";

export const useOrganizationBookings = (status?: string, limit = 50) => {
  return useInfiniteQuery({
    queryKey: ["organization-bookings", status],
    queryFn: ({ pageParam = 0 }) =>
      organizationBookingsService.getBookings(status, limit, pageParam),
    getNextPageParam: (lastPage) => {
      const { offset, limit, hasMore } = lastPage.pagination;
      return hasMore ? offset + limit : undefined;
    },
    initialPageParam: 0,
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      status,
    }: {
      bookingId: string;
      status: "COMPLETED" | "CANCELLED";
    }) => organizationBookingsService.updateBookingStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-bookings"] });
    },
  });
};
