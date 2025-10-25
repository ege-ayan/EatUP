import { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  Package,
  ShoppingCart,
  Store,
  Clock,
  Calendar,
  Minus,
  Plus,
  ExternalLink,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Offering } from "../_services/offerings-service";
import { useCreateBooking } from "../_hooks/use-create-booking";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface OfferingDialogProps {
  offering: Offering;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
}

export const OfferingDialog = ({
  offering,
  open,
  onOpenChange,
  trigger,
}: OfferingDialogProps) => {
  const [quantity, setQuantity] = useState(1);
  const createBookingMutation = useCreateBooking();

  const maxQuantity = Math.min(
    offering.maxReservationPerCustomer || 1,
    offering.stock
  );

  const discountPercentage = offering.originalPrice
    ? Math.round(
        ((offering.originalPrice - offering.price) / offering.originalPrice) *
          100
      )
    : 0;

  const getStockColor = (stock: number) => {
    if (stock > 10) return "bg-green-600";
    if (stock > 5) return "bg-yellow-600";
    return "bg-red-600";
  };

  const calculatePickupDeadline = () => {
    const now = new Date();
    const duration = offering.bookingDuration || 30;
    const deadline = new Date(now.getTime() + duration * 60000);
    return deadline.toLocaleString("tr-TR", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBook = async () => {
    // Validation
    if (quantity < 1) {
      toast.error("Miktar en az 1 olmalıdır");
      return;
    }

    if (quantity > maxQuantity) {
      toast.error(`Maksimum ${maxQuantity} adet rezervasyon yapabilirsiniz`);
      return;
    }

    const currentQuantity = quantity;
    onOpenChange(false);

    const pickupDeadline = calculatePickupDeadline();
    const result = await Swal.fire({
      title: "Rezervasyon Onayı",
      html: `
        <div style="text-align: center;">
          <p><strong>${currentQuantity} adet ${offering.name}</strong> rezerve etmek istediğinizden emin misiniz?</p>
          <p style="margin-top: 12px; color: #f59e0b; font-weight: 500;">
          ${pickupDeadline}'a kadar almanız gerekecek.
          </p>
        </div>
      `,
      icon: "question",
      iconColor: "#16a34a",
      reverseButtons: true,
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Evet",
      cancelButtonText: "Vazgeç",
    });

    if (!result.isConfirmed) {
      onOpenChange(true);
      return;
    }

    try {
      await createBookingMutation.mutateAsync({
        offeringId: offering.id,
        quantity: currentQuantity,
      });

      toast.success("Rezervasyon başarıyla oluşturuldu!");
      setQuantity(1);
    } catch (error) {
      console.error(error);

      const errorMessage =
        error instanceof Error ? error.message : "Rezervasyon oluşturulamadı";

      await Swal.fire({
        title: "Hata",
        text: errorMessage,
        icon: "error",
        iconColor: "#dc2626",
        confirmButtonColor: "#16a34a",
        confirmButtonText: "Tamam",
      });

      onOpenChange(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div onClick={() => onOpenChange(true)}>{trigger}</div>

      <DialogContent
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0 gap-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{offering.name}</DialogTitle>
          <DialogDescription>
            {offering.category.name} • {offering.organization.name} • ₺
            {offering.price.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <div className="relative h-80 bg-gray-100">
          <Image
            src={offering.image ?? "/images/placeholder.jpg"}
            alt={offering.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 600px"
          />

          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <Badge className="bg-orange-500 text-white font-semibold shadow-md w-fit">
              {offering.category.name}
            </Badge>
            {discountPercentage > 0 && (
              <Badge className="bg-green-600 text-white font-bold shadow-md w-fit">
                %{discountPercentage} İNDİRİM
              </Badge>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-6">
          {/* Title and Restaurant with Stock */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {offering.name}
              </h2>
              <div className="flex items-center text-gray-600">
                <Store className="w-4 h-4 mr-2" />
                <span>{offering.organization.name}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getStockColor(
                  offering.stock
                )} text-white font-medium text-sm`}
              >
                <Package className="w-4 h-4" />
                <span>{offering.stock} adet</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Users className="w-3 h-3" />
                <span>Max {offering.maxReservationPerCustomer}/kişi</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {offering.description && (
            <p className="text-gray-600 leading-relaxed">
              {offering.description}
            </p>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                offering.organization.locationName
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 group-hover:text-blue-600" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 mb-0.5">Konum</p>
                <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                  {offering.organization.locationName}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </a>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Alım Süresi</p>
                <p className="text-sm font-medium text-gray-900">
                  {offering.bookingDuration} dakika
                </p>
              </div>
            </div>
          </div>

          {/* Expiration Date */}
          {offering.expirationDate && (
            <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <Calendar className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-amber-700 mb-0.5">Son Geçerlilik</p>
                <p className="text-sm font-medium text-amber-900">
                  {new Date(offering.expirationDate).toLocaleString("tr-TR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Price and Action Row */}
          <div className="flex items-end justify-between gap-4 pt-4 border-t mt-4">
            {/* Price Section */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Toplam Fiyat</p>
              {offering.originalPrice && (
                <p className="text-sm text-gray-400 line-through">
                  ₺{(offering.originalPrice * quantity).toFixed(2)}
                </p>
              )}
              <p className="text-3xl font-bold text-green-600">
                ₺{(offering.price * quantity).toFixed(2)}
              </p>
            </div>

            {/* Quantity Selector and Reserve Button */}
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  max={maxQuantity}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setQuantity(Math.min(Math.max(1, val), maxQuantity));
                  }}
                  autoFocus={false}
                  className="h-10 w-16 text-center text-lg font-semibold"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() =>
                    setQuantity(Math.min(maxQuantity, quantity + 1))
                  }
                  disabled={quantity >= maxQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Reserve Button */}
              <Button
                onClick={handleBook}
                disabled={
                  offering.stock === 0 || createBookingMutation.isPending
                }
                className="h-12 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createBookingMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Yükleniyor...
                  </span>
                ) : offering.stock === 0 ? (
                  <span className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Stokta Yok
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Rezerv Et
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
