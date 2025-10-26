import { z } from "zod";

// Base input schema for form (strings, no transformation)
const addOfferingInputSchema = z.object({
  name: z.string().min(1, "İsim gereklidir").max(100, "İsim çok uzun"),
  description: z.string().optional(),
  price: z
    .string()
    .min(1, "Fiyat gereklidir")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
      message: "Fiyat 1'den büyük bir sayı olmalıdır",
    }),
  originalPrice: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(Number(val)) && Number(val) >= 1),
      {
        message: "Orijinal fiyat 1'den büyük bir sayı olmalıdır",
      }
    ),
  stock: z
    .string()
    .min(1, "Stok miktarı gereklidir")
    .refine(
      (val) => !isNaN(Number(val)) && Number.isInteger(Number(val)) && Number(val) >= 1,
      {
        message: "Stok miktarı en az 1 olan bir tam sayı olmalıdır",
      }
    ),
  maxReservationPerCustomer: z
    .string()
    .min(1, "Müşteri başına maksimum rezervasyon gereklidir")
    .refine(
      (val) => !isNaN(Number(val)) && Number.isInteger(Number(val)) && Number(val) >= 1,
      {
        message: "Müşteri başına maksimum rezervasyon en az 1 olan bir tam sayı olmalıdır",
      }
    ),
  bookingDuration: z
    .string()
    .min(1, "Bekleme süresi gereklidir")
    .refine(
      (val) => {
        const num = Number(val);
        return (
          !isNaN(num) &&
          Number.isInteger(num) &&
          num >= 1 &&
          num <= 480
        );
      },
      {
        message: "Bekleme süresi 1 ile 480 arasında bir tam sayı olmalıdır",
      }
    ),
  expirationDate: z
    .string()
    .min(1, "Son geçerlilik tarihi gereklidir")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date > new Date();
    }, "Son geçerlilik tarihi geçerli bir gelecek tarihi olmalıdır"),
  categoryId: z.string().min(1, "Kategori seçimi gereklidir"),
  image: z.url("Geçerli bir resim URL'i giriniz").optional().or(z.literal("")),
});

// Form schema with custom validation
export const addOfferingFormSchema = addOfferingInputSchema
  .extend({
    imageFile: z.instanceof(File).optional(),
  })
  .refine(
    (data) => {
      if (data.originalPrice && data.originalPrice !== "") {
        return Number(data.originalPrice) >= Number(data.price);
      }
      return true;
    },
    {
      message: "Orijinal fiyat satış fiyatından küçük olamaz",
      path: ["originalPrice"],
    }
  );

// API schema with transformations for backend
export const addOfferingSchema = z.object({
  name: z.string().min(1, "İsim gereklidir").max(100, "İsim çok uzun"),
  description: z.string().optional(),
  price: z.number().min(1, "Fiyat 1'den büyük olmalıdır"),
  originalPrice: z
    .number()
    .min(1, "Orijinal fiyat 1'den büyük olmalıdır")
    .optional(),
  stock: z.number().int().min(1, "Stok miktarı en az 1 olmalıdır"),
  maxReservationPerCustomer: z
    .number()
    .int()
    .min(1, "Müşteri başına maksimum rezervasyon en az 1 olmalıdır"),
  bookingDuration: z
    .number()
    .int()
    .min(1, "Bekleme süresi en az 1 dakika olmalıdır")
    .max(480, "Bekleme süresi en fazla 8 saat olabilir"),
  expirationDate: z
    .string()
    .min(1, "Son geçerlilik tarihi gereklidir")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date > new Date();
    }, "Son geçerlilik tarihi geçerli bir gelecek tarihi olmalıdır"),
  categoryId: z.string().min(1, "Kategori seçimi gereklidir"),
  image: z.url("Geçerli bir resim URL'i giriniz").optional().or(z.literal("")),
});

export const addOfferingApiSchema = addOfferingSchema.extend({
  organizationId: z.string().min(1, "Organizasyon ID gereklidir"),
});

// Update schemas (similar to add but with optional organizationId)
export const updateOfferingFormSchema = addOfferingFormSchema;
export const updateOfferingSchema = addOfferingSchema;
export const updateOfferingApiSchema = updateOfferingSchema.extend({
  id: z.string().min(1, "Ürün ID gereklidir"),
  organizationId: z.string().min(1, "Organizasyon ID gereklidir").optional(),
});

export type AddOfferingFormData = z.infer<typeof addOfferingFormSchema>;
export type AddOfferingApiData = z.infer<typeof addOfferingApiSchema>;
export type UpdateOfferingFormData = z.infer<typeof updateOfferingFormSchema>;
export type UpdateOfferingApiData = z.infer<typeof updateOfferingApiSchema>;
