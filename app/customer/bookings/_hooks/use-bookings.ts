import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  bookingsService,
  BookingsResult,
  Booking,
} from "../_services/bookings-service";

export const useBookings = (status?: string, limit = 20) => {
  return useInfiniteQuery<BookingsResult>({
    queryKey: ["bookings", status, limit],
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      bookingsService.getBookings(status, limit, pageParam as number),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.offset + lastPage.pagination.limit;
      }
      return undefined;
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Booking,
    Error,
    { bookingId: string; status: "COMPLETED" | "CANCELLED" }
  >({
    mutationFn: ({ bookingId, status }) =>
      bookingsService.updateBookingStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["offerings"] });
    },
  });
};
