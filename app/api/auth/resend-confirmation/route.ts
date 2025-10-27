import { NextRequest, NextResponse } from "next/server";
import { resendConfirmationEmail } from "@/lib/user-confirmation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "E-posta adresi gerekli" },
        { status: 400 }
      );
    }

    try {
      await resendConfirmationEmail(email);
      
      return NextResponse.json({
        success: true,
        message: "Onay e-postası tekrar gönderildi. Lütfen e-postanızı kontrol edin.",
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Kullanıcı bulunamadı") {
          // Return success anyway for security (don't reveal if email exists)
          return NextResponse.json({
            success: true,
            message: "Eğer bu e-posta kayıtlıysa, onay e-postası gönderildi.",
          });
        }
        
        if (error.message === "E-posta zaten onaylanmış") {
          return NextResponse.json(
            {
              success: false,
              error: "Bu e-posta adresi zaten onaylanmış.",
            },
            { status: 400 }
          );
        }
      }

      throw error;
    }
  } catch (error) {
    console.error("Resend confirmation API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      },
      { status: 500 }
    );
  }
}
