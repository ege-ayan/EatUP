import Image from "next/image";
import { useState } from "react";
import {
  MapPin,
  Package,
  ShoppingCart,
  Percent,
  Building2,
  Clock,
  Calendar,
  X,
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

interface OfferingDialogProps {
  offering: Offering;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBook?: (offering: Offering) => void;
  trigger: React.ReactNode;
}

export const OfferingDialog = ({
  offering,
  open,
  onOpenChange,
  onBook,
  trigger,
}: OfferingDialogProps) => {
  const [imageError, setImageError] = useState(false);

  const discountPercentage = offering.originalPrice
    ? Math.round(
        ((offering.originalPrice - offering.price) / offering.originalPrice) *
          100
      )
    : 0;

  const handleBook = () => {
    onBook?.(offering);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div onClick={() => onOpenChange(true)}>{trigger}</div>

      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{offering.name}</DialogTitle>
          <DialogDescription>
            {offering.category.name} ürün detayı • {offering.organization.name}{" "}
            • ₺{offering.price.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 bg-white/80 hover:bg-white/90 rounded-full shadow-sm"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Image */}
          <div className="relative h-72 bg-gray-100">
            {offering.image && !imageError ? (
              <Image
                src={offering.image}
                alt={offering.name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-8xl text-gray-400">🍽️</div>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    {offering.name}
                  </h1>
                  <p className="text-white/90 text-sm">
                    {offering.category.name} • {offering.organization.name}
                  </p>
                </div>
                {discountPercentage > 0 && (
                  <Badge className="bg-green-600 text-white font-bold">
                    <Percent className="w-4 h-4 mr-1" />
                    {discountPercentage}% OFF
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {offering.description && (
              <div>
                <p className="text-gray-600 leading-relaxed">
                  {offering.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Building2 className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Restoran</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {offering.organization.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Konum</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {offering.organization.locationName}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Package className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Stok</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {offering.stock} adet
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Gel-al Süresi
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {offering.bookingDuration} dk
                  </p>
                </div>
              </div>
            </div>

            {offering.expirationDate && (
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Son Geçerlilik
                  </p>
                  <p className="text-sm text-blue-700">
                    {new Date(offering.expirationDate).toLocaleString("tr-TR")}
                  </p>
                </div>
              </div>
            )}

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="text-3xl font-bold text-green-600">
                      ₺{offering.price.toFixed(2)}
                    </div>
                    {offering.originalPrice && (
                      <div className="text-sm text-gray-400 line-through">
                        ₺{offering.originalPrice.toFixed(2)}
                      </div>
                    )}
                  </div>
                  {discountPercentage > 0 && (
                    <Badge className="bg-green-600 text-white font-bold">
                      <Percent className="w-4 h-4 mr-1" />
                      {discountPercentage}% İNDİRİM
                    </Badge>
                  )}
                </div>
              </div>

              <Button
                onClick={handleBook}
                disabled={offering.stock === 0}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold text-base rounded-lg transition-all"
              >
                {offering.stock === 0 ? (
                  <span className="flex items-center justify-center gap-2">
                    <Package className="w-5 h-5" />
                    Stokta Yok
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Şimdi Rezerv Et
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
