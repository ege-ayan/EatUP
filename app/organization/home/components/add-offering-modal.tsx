"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { X, Image as ImageIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "../hooks/use-categories";
import {
  addOfferingFormSchema,
  type AddOfferingFormData,
} from "@/lib/schemas/offering-schemas";
import { uploadImage } from "@/lib/supabase";
import { useUserStore } from "@/lib/stores/user-store";

interface AddOfferingModalProps {
  children: React.ReactNode;
}

export function AddOfferingModal({ children }: AddOfferingModalProps) {
  const [open, setOpen] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);

  const { data: categoriesResponse } = useCategories();

  const categories = categoriesResponse?.categories || [];

  // Reset upload error when modal opens
  useEffect(() => {
    if (open) {
      setUploadError(null);
    }
  }, [open]);

  const form = useForm<AddOfferingFormData>({
    resolver: zodResolver(addOfferingFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      originalPrice: 0,
      stock: 0,
      categoryId: "",
      imageFile: undefined,
    },
  });

  const createOfferingMutation = useMutation({
    mutationFn: async (data: AddOfferingFormData) => {
      let imageUrl = "";

      // Upload image if provided (optional - don't fail if bucket doesn't exist)
      if (data.imageFile) {
        setIsUploading(true);
        try {
          imageUrl = await uploadImage(data.imageFile);
        } catch (error) {
          console.warn(
            "Image upload failed (continuing without image):",
            error
          );
          setUploadError(
            "Resim yüklenemedi, ürün görseli olmadan devam edilecek"
          );
          // Don't throw error - continue without image
          imageUrl = "";
        } finally {
          setIsUploading(false);
        }
      }

      // Create offering
      const offeringData = {
        name: data.name,
        description: data.description || "",
        price: data.price,
        ...(data.originalPrice &&
          data.originalPrice > 0 && { originalPrice: data.originalPrice }),
        stock: data.stock,
        categoryId: data.categoryId,
        image: imageUrl || "",
        organizationId: user?.id || "",
      };

      const response = await axios.post("/api/offerings", offeringData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-offerings"] });
      setOpen(false);
      form.reset();
      setUploadedImageUrl(null);
      setUploadError(null);
    },
    onError: (error: AxiosError) => {
      console.error("Failed to create offering:", error);
      if (
        error.response?.data &&
        typeof error.response.data === "object" &&
        "error" in error.response.data
      ) {
        console.error(
          "API Error:",
          (error.response.data as { error: string }).error
        );
      }
    },
  });

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      form.setValue("imageFile", file);
      setUploadedImageUrl(URL.createObjectURL(file));
      setUploadError(null); // Reset any previous upload error
    }
  };

  const removeImage = () => {
    form.setValue("imageFile", undefined);
    setUploadedImageUrl(null);
    setUploadError(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const onSubmit = (data: AddOfferingFormData) => {
    createOfferingMutation.mutate(data);
  };

  const isLoading = createOfferingMutation.isPending || isUploading;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Ürün Ekle</DialogTitle>
          <DialogDescription>
            Ürün bilgilerini doldurarak yeni bir ürün ekleyin.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ürün Adı *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ürün adını giriniz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ürün açıklaması (opsiyonel)"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fiyat (₺) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orijinal Fiyat (₺)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok Miktarı *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçiniz" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Ürün Görseli (Opsiyonel)</FormLabel>
              {uploadError && (
                <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                  ⚠️ {uploadError}
                </div>
              )}
              {!uploadedImageUrl ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-primary bg-primary/5"
                      : "border-gray-300 hover:border-primary"
                  }`}
                >
                  <input {...getInputProps()} />
                  <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    {isDragActive
                      ? "Resmi buraya bırakın"
                      : "Resmi sürükleyip bırakın veya tıklayın"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, JPEG, WebP (max 5MB)
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <Image
                    src={uploadedImageUrl!}
                    alt="Uploaded preview"
                    width={320}
                    height={128}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                İptal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Kaydediliyor..." : "Ürün Ekle"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
