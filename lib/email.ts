import { Resend } from "resend";
import { ResetPasswordTemplate } from "@/components/mail/reset-password-template";
import { EmailConfirmationTemplate } from "@/components/mail/email-confirmation-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
) {
  const resetUrl = `${process.env
    .NEXT_PUBLIC_APP_URL!}/auth/reset-password?token=${resetToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: `EatUp <${process.env.RESEND_FROM_EMAIL!}>`,
      to: email,
      subject: "Şifre Sıfırlama Talebi - EatUP",
      react: ResetPasswordTemplate({ resetUrl }),
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error("E-posta gönderilemedi");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("E-posta gönderilemedi");
  }
}

export async function sendConfirmationEmail(
  email: string,
  name: string,
  confirmToken: string
) {
  const confirmUrl = `${process.env
    .NEXT_PUBLIC_APP_URL!}/auth/confirm-email?token=${confirmToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: `EatUp <${process.env.RESEND_FROM_EMAIL!}>`,
      to: email,
      subject: "E-posta Adresinizi Onaylayın - EatUP",
      react: EmailConfirmationTemplate({ confirmUrl, name }),
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error("E-posta gönderilemedi");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("E-posta gönderilemedi");
  }
}
