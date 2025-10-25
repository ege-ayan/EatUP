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

  // Validate quantity
  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  // Check if user already has an ACTIVE booking for this offering
  const existingActiveBooking = await prisma.booking.findFirst({
    where: {
      userId,
      offeringId,
      status: {
        in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
      },
    },
  });

  if (existingActiveBooking) {
    throw new Error("You have already reserved this offering");
  }

  const offering = await prisma.offering.findUnique({
    where: { id: offeringId },
    select: {
      price: true,
      stock: true,
      maxReservationPerCustomer: true,
      bookingDuration: true,
    },
  });

  if (!offering) {
    throw new Error("Offering not found");
  }

  if (offering.stock < quantity) {
    throw new Error("Insufficient stock");
  }

  // Validate quantity against max reservation per customer
  if (quantity > offering.maxReservationPerCustomer) {
    throw new Error(
      `Maximum ${offering.maxReservationPerCustomer} items can be reserved per customer`
    );
  }

  const totalPrice = offering.price * quantity;

  // Calculate pickup time: current time + booking duration (in minutes)
  const pickupTime = new Date();
  pickupTime.setMinutes(
    pickupTime.getMinutes() + (offering.bookingDuration || 30)
  );

  const booking = await prisma.booking.create({
    data: {
      userId,
      offeringId,
      quantity,
      notes,
      totalPrice,
      pickupTime,
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
  // Get the booking first to check if we need to return stock
  const existingBooking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      offering: true,
    },
  });

  if (!existingBooking) {
    throw new Error("Booking not found");
  }

  // If cancelling a booking, return the stock
  if (
    status === BookingStatus.CANCELLED &&
    (existingBooking.status === BookingStatus.PENDING ||
      existingBooking.status === BookingStatus.CONFIRMED)
  ) {
    await prisma.offering.update({
      where: { id: existingBooking.offeringId },
      data: { stock: { increment: existingBooking.quantity } },
    });
  }

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
