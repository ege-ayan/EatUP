import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(1, "Şifre gereklidir"),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, "Ad gereklidir").max(50, "Ad çok uzun"),
    surname: z.string().min(1, "Soyad gereklidir").max(50, "Soyad çok uzun"),
    email: z.email("Geçerli bir e-posta adresi giriniz"),
    password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

export const registerApiSchema = registerSchema.omit({ confirmPassword: true });

export const forgotPasswordSchema = z.object({
  email: z.email("Geçerli bir e-posta adresi giriniz"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Şifre en az 6 karakter olmalıdır")
      .max(100, "Şifre en fazla 100 karakter olabilir"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

export const resetPasswordApiSchema = z
  .object({
    token: z.string().min(1, "Token gereklidir"),
    password: z
      .string()
      .min(6, "Şifre en az 6 karakter olmalıdır")
      .max(100, "Şifre en fazla 100 karakter olabilir"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });
