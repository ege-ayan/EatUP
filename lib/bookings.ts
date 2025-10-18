import { prisma } from "./prisma";
import { Prisma, BookingStatus } from "@/generated/prisma";

type Booking = Prisma.BookingGetPayload<{
  include: {
    offering: {
      include: {
        organization: true;
      };
    };
  };
}>;

export interface BookingsFilter {
  status?: string;
  userId?: string;
}

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export interface BookingsResult {
  bookings: Booking[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export async function getBookings(
  filter: BookingsFilter = {},
  pagination: PaginationOptions = {}
): Promise<BookingsResult> {
  const { status, userId } = filter;
  const { limit = 20, offset = 0 } = pagination;

  const where: Record<string, unknown> = {};

  if (status) {
    where.status = status;
  }

  if (userId) {
    where.userId = userId;
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      offering: {
        include: {
          organization: true,
        },
      },
    },
    orderBy: [{ createdAt: "desc" }],
    take: limit,
    skip: offset,
  });

  const totalCount = await prisma.booking.count({ where });

  return {
    bookings,
    pagination: {
      total: totalCount,
      limit,
      offset,
      hasMore: offset + limit < totalCount,
    },
  };
}

export async function createBooking(data: {
  userId: string;
  offeringId: string;
  quantity?: number;
  notes?: string;
}): Promise<Booking> {
  const { userId, offeringId, quantity = 1, notes } = data;

  const offering = await prisma.offering.findUnique({
    where: { id: offeringId },
    select: { price: true, stock: true, bookingDuration: true },
  });

  if (!offering) {
    throw new Error("Offering not found");
  }

  if (offering.stock < quantity) {
    throw new Error("Insufficient stock");
  }

  const totalPrice = offering.price * quantity;

  const booking = await prisma.booking.create({
    data: {
      userId,
      offeringId,
      quantity,
      notes,
      totalPrice,
    },
    include: {
      offering: {
        include: {
          organization: true,
        },
      },
    },
  });

  // Update offering stock
  await prisma.offering.update({
    where: { id: offeringId },
    data: { stock: { decrement: quantity } },
  });

  return booking;
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<Booking> {
  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
    include: {
      offering: {
        include: {
          organization: true,
        },
      },
    },
  });

  return booking;
}
