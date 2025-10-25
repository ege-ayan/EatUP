import axios from "axios";
import { Prisma } from "@/generated/prisma";

type OrganizationBooking = Prisma.BookingGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        surname: true;
        email: true;
      };
    };
    offering: {
      include: {
        category: true;
      };
    };
  };
}>;

type BookingsResult = {
  bookings: OrganizationBooking[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
};

export type { OrganizationBooking, BookingsResult };

export const organizationBookingsService = {
  async getBookings(
    status?: string,
    limit = 50,
    offset = 0
  ): Promise<BookingsResult> {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    params.append("limit", limit.toString());
    params.append("offset", offset.toString());

    const response = await axios.get<BookingsResult>(
      `/api/bookings/organization?${params.toString()}`
    );
    return response.data;
  },

  async updateBookingStatus(
    bookingId: string,
    status: "COMPLETED" | "CANCELLED"
  ): Promise<OrganizationBooking> {
    const response = await axios.patch<OrganizationBooking>(
      `/api/bookings/${bookingId}`,
      { status }
    );
    return response.data;
  },
};
