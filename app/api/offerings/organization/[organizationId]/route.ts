import { NextRequest, NextResponse } from "next/server";
import { getOfferings } from "@/lib/offerings";
import { prisma } from "@/lib/prisma";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    const { organizationId } = await params;

    if (!organizationId) {
      return NextResponse.json(
        { success: false, error: "Organization ID required" },
        { status: 400 }
      );
    }

    // Verify organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { id: true },
    });

    if (!organization) {
      return NextResponse.json(
        { success: false, error: "Organization not found" },
        { status: 404 }
      );
    }

    const result = await getOfferings(
      { organizationId },
      { limit: 100, offset: 0 }
    );

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Organization offerings API error:", error);
    return NextResponse.json(
      { success: false, error: "Teklifler alınamadı" },
      { status: 500 }
    );
  }
}
