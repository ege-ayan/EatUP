import { NextRequest, NextResponse } from "next/server";
import { getBookings, createBooking } from "@/lib/bookings";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 20;
    const offset = searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : 0;

    const result = await getBookings(
      { status, userId: user.id },
      { limit, offset }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { offeringId, quantity = 1, notes } = body;

    if (!offeringId) {
      return NextResponse.json(
        { error: "Offering ID is required" },
        { status: 400 }
      );
    }

    const booking = await createBooking({
      userId: user.id,
      offeringId,
      quantity,
      notes,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);

    if (error instanceof Error) {
      if (error.message === "Offering not found") {
        return NextResponse.json(
          { error: "Offering not found" },
          { status: 404 }
        );
      }

      if (error.message === "Insufficient stock") {
        return NextResponse.json(
          { error: "Insufficient stock" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
