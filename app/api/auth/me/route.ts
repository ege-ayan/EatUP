import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Oturum bulunamadı" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Kullanıcı bilgileri API hatası:", error);
    return NextResponse.json(
      { success: false, error: "Kullanıcı bilgileri alınamadı" },
      { status: 500 }
    );
  }
}
