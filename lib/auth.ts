import * as bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { sendUserConfirmationEmail } from "./user-confirmation";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "30d";

export async function validateCredentials(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Geçersiz e-posta veya şifre");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Geçersiz e-posta veya şifre");
    }

    // Check if email is confirmed
    if (user.emailConfirmationStatus !== "CONFIRMED") {
      throw new Error(
        "E-posta adresiniz henüz onaylanmamış. Lütfen e-postanızı kontrol edin veya yeni bir onay e-postası talep edin."
      );
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  } catch (error) {
    console.error("Kimlik doğrulama hatası:", error);
    throw error;
  }
}

export async function login(email: string, password: string) {
  try {
    const result = await validateCredentials(email, password);

    const token = await new SignJWT({
      userId: result.user.id,
      email: result.user.email,
      name: result.user.name,
      surname: result.user.surname,
      role: result.user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRES_IN)
      .sign(new TextEncoder().encode(JWT_SECRET));

    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return result;
  } catch (error) {
    console.error("Giriş hatası:", error);
    throw error;
  }
}

export async function register(data: {
  name: string;
  surname: string;
  email: string;
  password: string;
}) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("Kullanıcı zaten mevcut");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        surname: data.surname,
        email: data.email,
        password: hashedPassword,
        emailConfirmationStatus: "PENDING",
      },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        emailConfirmationStatus: true,
        createdAt: true,
      },
    });

    // Send confirmation email
    try {
      await sendUserConfirmationEmail(user.id, user.email, user.name);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail registration if email sending fails
      // User can request a new confirmation email later
    }

    return {
      success: true,
      user,
      message:
        "Kayıt başarılı! Lütfen e-posta adresinizi onaylamak için gelen kutunuzu kontrol edin.",
    };
  } catch (error) {
    console.error("Kayıt hatası:", error);
    throw error;
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");
    return { success: true };
  } catch (error) {
    console.error("Çıkış hatası:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        role: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Kullanıcı bilgileri alınırken hata:", error);
    return null;
  }
}
