import * as bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "30d";

export async function login(email: string, password: string) {
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

    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
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

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
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
      },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        createdAt: true,
      },
    });

    return { success: true, user };
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
