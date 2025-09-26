import { NextResponse } from "next/server";
import { logout } from "@/lib/auth";

export async function POST() {
  try {
    await logout();
    return NextResponse.json({ success: true, message: "Çıkış başarılı" });
  } catch (error) {
    console.error("API çıkış hatası:", error);
    return NextResponse.json(
      { success: false, error: "Çıkış başarısız" },
      { status: 500 }
    );
  }
}
