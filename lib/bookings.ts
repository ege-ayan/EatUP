import { prisma } from "./prisma";

export interface Booking {
  id: string;
  userId: string;
  offeringId: string;
  quantity: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  pickupTime?: string;
  notes?: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  offering: {
    id: string;
    name: string;
    organization: {
      id: string;
      name: string;
      locationName: string;
    };
  };
}

export interface BookingsResponse {
  bookings: Booking[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

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
        select: {
          id: true,
          name: true,
          organization: {
            select: {
              id: true,
              name: true,
              locationName: true,
            },
          },
        },
      },
    },
    orderBy: [{ createdAt: "desc" }],
    take: limit,
    skip: offset,
  });

  const totalCount = await prisma.booking.count({ where });

  return {
    bookings: bookings.map((booking) => ({
      id: booking.id,
      userId: booking.userId,
      offeringId: booking.offeringId,
      quantity: booking.quantity,
      status: booking.status as Booking["status"],
      pickupTime: booking.pickupTime?.toISOString(),
      notes: booking.notes || undefined,
      totalPrice: booking.totalPrice,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      offering: {
        id: booking.offering.id,
        name: booking.offering.name,
        organization: {
          id: booking.offering.organization.id,
          name: booking.offering.organization.name,
          locationName: booking.offering.organization.locationName,
        },
      },
    })),
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

  // Get the offering to calculate total price
  const offering = await prisma.offering.findUnique({
    where: { id: offeringId },
    select: { price: true, stock: true },
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
        select: {
          id: true,
          name: true,
          organization: {
            select: {
              id: true,
              name: true,
              locationName: true,
            },
          },
        },
      },
    },
  });

  // Update offering stock
  await prisma.offering.update({
    where: { id: offeringId },
    data: { stock: { decrement: quantity } },
  });

  return {
    id: booking.id,
    userId: booking.userId,
    offeringId: booking.offeringId,
    quantity: booking.quantity,
    status: booking.status as Booking["status"],
    pickupTime: booking.pickupTime?.toISOString(),
    notes: booking.notes || undefined,
    totalPrice: booking.totalPrice,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    offering: {
      id: booking.offering.id,
      name: booking.offering.name,
      organization: {
        id: booking.offering.organization.id,
        name: booking.offering.organization.name,
        locationName: booking.offering.organization.locationName,
      },
    },
  };
}

export async function updateBookingStatus(
  bookingId: string,
  status: Booking["status"]
): Promise<Booking> {
  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
    include: {
      offering: {
        select: {
          id: true,
          name: true,
          organization: {
            select: {
              id: true,
              name: true,
              locationName: true,
            },
          },
        },
      },
    },
  });

  return {
    id: booking.id,
    userId: booking.userId,
    offeringId: booking.offeringId,
    quantity: booking.quantity,
    status: booking.status as Booking["status"],
    pickupTime: booking.pickupTime?.toISOString(),
    notes: booking.notes || undefined,
    totalPrice: booking.totalPrice,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    offering: {
      id: booking.offering.id,
      name: booking.offering.name,
      organization: {
        id: booking.offering.organization.id,
        name: booking.offering.organization.name,
        locationName: booking.offering.organization.locationName,
      },
    },
  };
}

