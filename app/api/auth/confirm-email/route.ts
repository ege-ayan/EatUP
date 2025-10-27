import { NextRequest, NextResponse } from "next/server";
import { verifyConfirmationToken, confirmUserEmail } from "@/lib/user-confirmation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token gerekli" },
        { status: 400 }
      );
    }

    // Verify token
    let tokenData;
    try {
      tokenData = await verifyConfirmationToken(token);
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json(
        {
          success: false,
          error:
            "Geçersiz veya süresi dolmuş token. Lütfen yeni bir onay e-postası talep edin.",
        },
        { status: 401 }
      );
    }

    // Confirm user email
    try {
      const result = await confirmUserEmail(tokenData.userId);
      
      return NextResponse.json({
        success: true,
        message: "E-posta adresiniz başarıyla onaylandı! Şimdi giriş yapabilirsiniz.",
        user: result.user,
      });
    } catch (error) {
      console.error("Email confirmation error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "E-posta onaylama başarısız oldu. Lütfen tekrar deneyin.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Confirm email API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      },
      { status: 500 }
    );
  }
}
