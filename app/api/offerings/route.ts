import { NextRequest, NextResponse } from "next/server";
import { getOfferings } from "@/lib/offerings";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const organizationId = searchParams.get("organizationId") || undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const offset = searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : undefined;

    const result = await getOfferings(
      { category, organizationId },
      { limit, offset }
    );

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Offerings API error:", error);
    return NextResponse.json(
      { success: false, error: "Teklifler alınamadı" },
      { status: 500 }
    );
  }
}
