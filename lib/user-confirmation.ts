import { SignJWT, jwtVerify } from "jose";
import { prisma } from "./prisma";
import { sendConfirmationEmail } from "./email";

const JWT_SECRET = process.env.JWT_SECRET;

export async function generateConfirmationToken(
  userId: string,
  email: string
): Promise<string> {
  const token = await new SignJWT({
    userId,
    email,
    type: "email-confirmation",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(new TextEncoder().encode(JWT_SECRET));

  return token;
}

export async function verifyConfirmationToken(token: string) {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    const payload = verified.payload;

    if (payload.type !== "email-confirmation") {
      throw new Error("Geçersiz token türü");
    }

    return {
      userId: payload.userId as string,
      email: payload.email as string,
    };
  } catch (error) {
    console.error("Token verification error:", error);
    throw new Error("Geçersiz veya süresi dolmuş token");
  }
}

export async function confirmUserEmail(userId: string) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        emailConfirmationStatus: "CONFIRMED",
      },
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        emailConfirmationStatus: true,
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error("Email confirmation error:", error);
    throw new Error("E-posta onaylama başarısız oldu");
  }
}

export async function sendUserConfirmationEmail(
  userId: string,
  email: string,
  name: string
) {
  try {
    const confirmToken = await generateConfirmationToken(userId, email);
    await sendConfirmationEmail(email, name, confirmToken);
    return { success: true };
  } catch (error) {
    console.error("Send confirmation email error:", error);
    throw new Error("Onay e-postası gönderilemedi");
  }
}

export async function isEmailConfirmed(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { emailConfirmationStatus: true },
    });

    return user?.emailConfirmationStatus === "CONFIRMED";
  } catch (error) {
    console.error("Check email confirmation error:", error);
    return false;
  }
}

export async function resendConfirmationEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        emailConfirmationStatus: true,
      },
    });

    if (!user) {
      throw new Error("Kullanıcı bulunamadı");
    }

    if (user.emailConfirmationStatus === "CONFIRMED") {
      throw new Error("E-posta zaten onaylanmış");
    }

    await sendUserConfirmationEmail(user.id, user.email, user.name);
    return { success: true };
  } catch (error) {
    console.error("Resend confirmation email error:", error);
    throw error;
  }
}
