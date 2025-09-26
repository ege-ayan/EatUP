import { NextRequest, NextResponse } from "next/server";
import { registerApiSchema } from "@/lib/schemas/auth-schemas";
import { register } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = registerApiSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validationResult.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const { name, surname, email, password } = validationResult.data;

    const result = await register({
      name,
      surname,
      email,
      password,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Registration API error:", error);

    if (error instanceof Error && error.message === "User already exists") {
      return NextResponse.json(
        { success: false, error: "Kullanıcı zaten mevcut" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
