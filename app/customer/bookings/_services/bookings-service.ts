import axios from "axios";
import { Prisma } from "@/lib/generated/prisma";

type Booking = Prisma.BookingGetPayload<{
  include: {
    offering: {
      include: {
        organization: true;
        category: true;
      };
    };
  };
}>;

type BookingsResult = {
  bookings: Booking[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
};

export type { Booking, BookingsResult };

export const bookingsService = {
  async getBookings(
    status?: string,
    limit = 20,
    offset = 0
  ): Promise<BookingsResult> {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    params.append("limit", limit.toString());
    params.append("offset", offset.toString());

    const response = await axios.get<BookingsResult>(
      `/api/bookings?${params.toString()}`
    );
    return response.data;
  },

  async updateBookingStatus(
    bookingId: string,
    status: "COMPLETED" | "CANCELLED"
  ): Promise<Booking> {
    const response = await axios.patch<Booking>(`/api/bookings/${bookingId}`, {
      status,
    });
    return response.data;
  },
};
