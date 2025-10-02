import { NextResponse } from "next/server";
import { getCategories } from "@/lib/offerings";

export async function GET() {
  try {
    const result = await getCategories();

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json(
      { success: false, error: "Kategoriler alınamadı" },
      { status: 500 }
    );
  }
}
