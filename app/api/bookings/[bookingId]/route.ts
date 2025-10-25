import { NextRequest, NextResponse } from "next/server";
import { updateBookingStatus } from "@/lib/bookings";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;
    const { bookingId } = await params;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    if (!["COMPLETED", "CANCELLED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be COMPLETED or CANCELLED" },
        { status: 400 }
      );
    }

    // Get booking with offering information to check authorization
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        offering: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check authorization
    // Customers can update their own bookings
    // Organizations can update bookings for their offerings
    const isCustomer =
      user.role === "CUSTOMER" && existingBooking.userId === user.id;
    const isOrganizationOwner =
      user.role === "ORGANIZATION" &&
      existingBooking.offering.organization.ownerId === user.id;

    if (!isCustomer && !isOrganizationOwner) {
      return NextResponse.json(
        { error: "You don't have permission to update this booking" },
        { status: 403 }
      );
    }

    // Update the booking
    const booking = await updateBookingStatus(
      bookingId,
      status as "COMPLETED" | "CANCELLED"
    );

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error updating booking:", error);

    if (error instanceof Error) {
      if (error.message === "Booking not found") {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
