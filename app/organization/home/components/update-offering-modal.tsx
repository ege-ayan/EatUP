"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { X, Image as ImageIcon, Calendar } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Custom styles for react-datepicker
const datePickerStyles = `
  .react-datepicker-custom .react-datepicker__header {
    background-color: #f3f4f6;
    border-bottom: 1px solid #e5e7eb;
  }

  .react-datepicker-custom .react-datepicker__current-month,
  .react-datepicker-custom .react-datepicker-time__header {
    color: #374151;
    font-weight: 600;
  }

  .react-datepicker-custom .react-datepicker__day--selected {
    background-color: #3b82f6;
  }

  .react-datepicker-custom .react-datepicker__day:hover {
    background-color: #dbeafe;
  }

  .react-datepicker-custom .react-datepicker__time-container {
    border-left: 1px solid #e5e7eb;
  }

  .react-datepicker-custom .react-datepicker-time__header {
    background-color: #f9fafb;
  }
`;

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  updateOfferingFormSchema,
  type UpdateOfferingFormData,
} from "@/schemas/offering-schemas";
import { uploadImage } from "@/lib/supabase";
import type { Offering } from "../services/offerings-service";

interface UpdateOfferingModalProps {
  offering: Offering;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateOfferingModal({
  offering,
  open,
  onOpenChange,
}: UpdateOfferingModalProps) {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
    offering.image
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    offering.expirationDate ? new Date(offering.expirationDate) : null
  );
  const queryClient = useQueryClient();

  const { data: categoriesResponse } = useCategories();
  const categories = categoriesResponse?.categories || [];

  useEffect(() => {
    if (open) {
      setUploadError(null);
      // Reset with current offering values
      setUploadedImageUrl(offering.image);
      setSelectedDate(
        offering.expirationDate ? new Date(offering.expirationDate) : null
      );
    } else {
      // Reset form when dialog closes
      form.reset();
      setSelectedDate(null);
      setUploadedImageUrl(null);
      setUploadError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Helper function to allow only positive numbers and decimal point
  const handleNumericInput = (
    value: string,
    allowDecimals: boolean = false
  ): string => {
    // Remove any character that is not a digit or decimal point
    let filtered = value.replace(/[^\d.]/g, "");

    // If decimals are not allowed, remove decimal points
    if (!allowDecimals) {
      filtered = filtered.replace(/\./g, "");
    } else {
      // Allow only one decimal point
      const parts = filtered.split(".");
      if (parts.length > 2) {
        filtered = parts[0] + "." + parts.slice(1).join("");
      }
    }

    return filtered;
  };

  const form = useForm<UpdateOfferingFormData>({
    resolver: zodResolver(updateOfferingFormSchema),
    defaultValues: {
      name: offering.name,
      description: offering.description || "",
      price: offering.price.toString(),
      originalPrice: offering.originalPrice?.toString() || "",
      stock: offering.stock.toString(),
      maxReservationPerCustomer: offering.maxReservationPerCustomer.toString(),
      bookingDuration: (offering.bookingDuration || 30).toString(),
      expirationDate: offering.expirationDate 
        ? (typeof offering.expirationDate === 'string' 
            ? offering.expirationDate 
            : new Date(offering.expirationDate).toISOString())
        : "",
      categoryId: offering.categoryId,
      imageFile: undefined,
    },
  });

  const updateOfferingMutation = useMutation({
    mutationFn: async (data: UpdateOfferingFormData) => {
      let imageUrl = uploadedImageUrl || "";

      if (data.imageFile) {
        setIsUploading(true);
        try {
          imageUrl = await uploadImage(data.imageFile);
        } catch (error) {
          console.warn(
            "Image upload failed (continuing with old image):",
            error
          );
          setUploadError(
            "Resim yüklenemedi, eski resim ile devam edilecek"
          );
          imageUrl = uploadedImageUrl || "";
        } finally {
          setIsUploading(false);
        }
      }

      const offeringData = {
        id: offering.id,
        name: data.name,
        description: data.description || "",
        price: Number(data.price),
        ...(data.originalPrice &&
          data.originalPrice !== "" && {
            originalPrice: Number(data.originalPrice),
          }),
        stock: Number(data.stock),
        maxReservationPerCustomer: Number(data.maxReservationPerCustomer),
        bookingDuration: Number(data.bookingDuration),
        expirationDate: data.expirationDate,
        categoryId: data.categoryId,
        image: imageUrl || "",
      };

      const response = await axios.put("/api/offerings", offeringData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-offerings"] });
      onOpenChange(false);
      toast.success("Ürün başarıyla güncellendi");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { error?: string })?.error ||
        "Ürün güncellenirken bir hata oluştu";
      toast.error(errorMessage);
    },
  });

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      form.setValue("imageFile", file);
      setUploadedImageUrl(URL.createObjectURL(file));
      setUploadError(null);
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
    maxSize: 5 * 1024 * 1024,
  });

  const onSubmit = (data: UpdateOfferingFormData) => {
    updateOfferingMutation.mutate(data);
  };

  const isLoading = updateOfferingMutation.isPending || isUploading;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: datePickerStyles }} />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ürün Düzenle</DialogTitle>
            <DialogDescription>
              Ürün bilgilerini güncelleyin.
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
                      <Input placeholder="Ürün adı" {...field} />
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
                        rows={3}
                        placeholder="Ürün açıklaması (opsiyonel)"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fiyat (₺) *</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => {
                            const filtered = handleNumericInput(
                              e.target.value,
                              true
                            );
                            field.onChange(filtered);
                          }}
                        />
                      </FormControl>
                      <FormMessage className="min-h-[20px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Orijinal Fiyat (₺)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => {
                            const filtered = handleNumericInput(
                              e.target.value,
                              true
                            );
                            field.onChange(filtered);
                          }}
                        />
                      </FormControl>
                      <FormMessage className="min-h-[20px]" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="bookingDuration"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Bekleme Süresi (dk) *</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="30"
                          className="w-full"
                          {...field}
                          onChange={(e) => {
                            const filtered = handleNumericInput(
                              e.target.value,
                              false
                            );
                            field.onChange(filtered);
                          }}
                        />
                      </FormControl>
                      <FormMessage className="min-h-[20px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expirationDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Son Geçerlilik Tarihi *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={`w-full pl-3 text-left font-normal ${
                                !selectedDate && "text-muted-foreground"
                              }`}
                            >
                              {selectedDate ? (
                                selectedDate.toLocaleString("tr-TR")
                              ) : (
                                <span>Tarih seçin</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <DatePicker
                            selected={selectedDate}
                            onChange={(date) => {
                              setSelectedDate(date);
                              field.onChange(date ? date.toISOString() : "");
                            }}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="Pp"
                            minDate={new Date()}
                            inline
                            className="react-datepicker-custom"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="min-h-[20px]" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Stok Miktarı *</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="1"
                          className="w-full"
                          {...field}
                          onChange={(e) => {
                            const filtered = handleNumericInput(
                              e.target.value,
                              false
                            );
                            field.onChange(filtered);
                          }}
                        />
                      </FormControl>
                      <FormMessage className="min-h-[20px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Kategori *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
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
                      <FormMessage className="min-h-[20px]" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="maxReservationPerCustomer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Müşteri Başına Maksimum Rezervasyon *</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="1"
                        {...field}
                        onChange={(e) => {
                          const filtered = handleNumericInput(
                            e.target.value,
                            false
                          );
                          field.onChange(filtered);
                        }}
                      />
                    </FormControl>
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
                {uploadedImageUrl ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={uploadedImageUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-2">
                      {isDragActive
                        ? "Resmi buraya bırakın..."
                        : "Resim yüklemek için tıklayın veya sürükleyin"}
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, WEBP (Maks. 5MB)
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  İptal
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Güncelleniyor..." : "Güncelle"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
