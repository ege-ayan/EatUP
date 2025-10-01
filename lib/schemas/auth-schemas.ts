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
