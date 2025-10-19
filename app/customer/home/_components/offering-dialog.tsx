import Image from "next/image";
import {
  MapPin,
  Package,
  ShoppingCart,
  Store,
  Clock,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const createBookingMutation = useCreateBooking();

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

  const handleBook = async () => {
    try {
      await createBookingMutation.mutateAsync({
        offeringId: offering.id,
        quantity: 1,
      });

      toast.success("Rezervasyon başarıyla oluşturuldu!");

      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Rezervasyon oluşturulamadı");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div onClick={() => onOpenChange(true)}>{trigger}</div>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0 gap-0">
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
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getStockColor(
                offering.stock
              )} text-white font-medium text-sm`}
            >
              <Package className="w-4 h-4" />
              <span>{offering.stock} adet</span>
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
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">Konum</p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {offering.organization.locationName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Hazırlık</p>
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

          {/* Price and Book Button */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              {offering.originalPrice && (
                <p className="text-sm text-gray-400 line-through mb-1">
                  ₺{offering.originalPrice.toFixed(2)}
                </p>
              )}
              <p className="text-3xl font-bold text-green-600">
                ₺{offering.price.toFixed(2)}
              </p>
            </div>

            <Button
              onClick={handleBook}
              disabled={offering.stock === 0 || createBookingMutation.isPending}
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
      </DialogContent>
    </Dialog>
  );
};
