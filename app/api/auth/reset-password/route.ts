import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import * as bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { resetPasswordApiSchema } from "@/schemas/auth-schemas";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = resetPasswordApiSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, errors: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { token, password } = validationResult.data;

    let payload;
    try {
      const verified = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );
      payload = verified.payload;
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json(
        {
          success: false,
          error:
            "Geçersiz veya süresi dolmuş token. Lütfen yeni bir şifre sıfırlama talebi oluşturun.",
        },
        { status: 401 }
      );
    }

    if (payload.type !== "password-reset") {
      return NextResponse.json(
        { success: false, error: "Geçersiz token türü" },
        { status: 401 }
      );
    }

    const userId = payload.userId as string;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: "Şifreniz başarıyla güncellendi. Şimdi giriş yapabilirsiniz.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      },
      { status: 500 }
    );
  }
}
