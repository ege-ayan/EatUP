import { NextRequest, NextResponse } from "next/server";
import { updateBookingStatus } from "@/lib/bookings";
import { getCurrentUser } from "@/lib/auth";

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

    const booking = await updateBookingStatus(
      bookingId,
      status as "COMPLETED" | "CANCELLED"
    );

    if (booking.userId !== user.id) {
      return NextResponse.json(
        { error: "You can only update your own bookings" },
        { status: 403 }
      );
    }

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
