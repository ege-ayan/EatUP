import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  offeringsService,
  CreateBookingData,
  Booking,
} from "../_services/offerings-service";

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<Booking, Error, CreateBookingData>({
    mutationFn: (data: CreateBookingData) =>
      offeringsService.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offerings"] });
    },
    onError: (error) => {
      console.error("Booking creation failed:", error);
    },
  });
};
