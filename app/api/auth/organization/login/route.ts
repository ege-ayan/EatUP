import { NextRequest, NextResponse } from "next/server";
import { validateCredentials, login } from "@/lib/auth";
import { loginSchema } from "@/lib/schemas/auth-schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, errors: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    const validationResultAuth = await validateCredentials(email, password);

    if (
      validationResultAuth.success &&
      validationResultAuth.user &&
      validationResultAuth.user.role !== "ORGANIZATION"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Bu giriş sadece organizasyon hesapları için geçerlidir",
        },
        { status: 403 }
      );
    }

    const result = await login(email, password);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Organizasyon giriş API hatası:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Giriş başarısız" },
      { status: 500 }
    );
  }
}
