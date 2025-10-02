import { z } from "zod";

export const addOfferingSchema = z.object({
  name: z.string().min(1, "İsim gereklidir").max(100, "İsim çok uzun"),
  description: z.string().optional(),
  price: z.number().min(0, "Fiyat 0'dan büyük olmalıdır"),
  originalPrice: z
    .number()
    .min(0, "Orijinal fiyat 0'dan büyük olmalıdır")
    .optional(),
  stock: z.number().int().min(0, "Stok miktarı 0'dan küçük olamaz"),
  categoryId: z.string().min(1, "Kategori seçimi gereklidir"),
  image: z
    .string()
    .url("Geçerli bir resim URL'i giriniz")
    .optional()
    .or(z.literal("")),
});

export const addOfferingFormSchema = addOfferingSchema
  .extend({
    imageFile: z.instanceof(File).optional(),
  })
  .refine(
    (data) => {
      // If originalPrice is provided, it should be greater than or equal to price
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
