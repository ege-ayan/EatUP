import { z } from "zod";

export const addOfferingSchema = z.object({
  name: z.string().min(1, "İsim gereklidir").max(100, "İsim çok uzun"),
  description: z.string().optional(),
  price: z.number().min(1, "Fiyat 1'den büyük olmalıdır"),
  originalPrice: z
    .number()
    .min(1, "Orijinal fiyat 1'den büyük olmalıdır")
    .optional(),
  stock: z.number().int().min(1, "Stok miktarı en az 1 olmalıdır"),
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

export const addOfferingFormSchema = addOfferingSchema
  .extend({
    imageFile: z.instanceof(File).optional(),
  })
  .refine(
    (data) => {
      if (data.originalPrice !== undefined) {
        return data.originalPrice >= data.price;
      }
      return true;
    },
    {
      message: "Orijinal fiyat satış fiyatından küçük olamaz",
      path: ["originalPrice"],
    }
  );

export const addOfferingApiSchema = addOfferingSchema.extend({
  organizationId: z.string().min(1, "Organizasyon ID gereklidir"),
});

export type AddOfferingFormData = z.infer<typeof addOfferingFormSchema>;
export type AddOfferingApiData = z.infer<typeof addOfferingApiSchema>;
