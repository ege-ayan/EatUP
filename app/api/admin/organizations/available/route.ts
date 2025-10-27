import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { UserRole } from "@/generated/prisma";
import { getAvailableOrganizations } from "@/lib/organizations";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const organizations = await getAvailableOrganizations();

    return NextResponse.json({
      success: true,
      organizations,
    });
  } catch (error) {
    console.error("Organizasyonlar alınamadı:", error);
    return NextResponse.json(
      { error: "Organizasyonlar alınamadı" },
      { status: 500 }
    );
  }
}
