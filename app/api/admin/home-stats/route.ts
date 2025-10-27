import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { UserRole } from "@/generated/prisma";
import { getAdminStats } from "@/lib/admin-stats";

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const stats = await getAdminStats();

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("İstatistikler alınamadı:", error);
    return NextResponse.json(
      { error: "İstatistikler alınamadı" },
      { status: 500 }
    );
  }
}
