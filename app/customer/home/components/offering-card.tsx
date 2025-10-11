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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Offering } from "../services/offerings-service";

interface OfferingCardProps {
  offering: Offering;
  onBook?: (offering: Offering) => void;
}

export const OfferingCard = ({ offering, onBook }: OfferingCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const discountPercentage = offering.originalPrice
    ? Math.round(
        ((offering.originalPrice - offering.price) / offering.originalPrice) *
          100
      )
    : 0;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Card className="overflow-hidden bg-white border border-gray-200 shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200">
          <div className="relative">
            {/* Organization badge */}
            <div className="absolute top-4 left-4 z-10">
              <Badge
                variant="secondary"
                className="bg-white/95 text-gray-700 text-xs font-medium px-3 py-1 shadow-sm"
              >
                <Building2 className="w-3 h-3 mr-1" />
                {offering.organization.name}
              </Badge>
            </div>

            {/* Discount badge */}
            {discountPercentage > 0 && (
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-green-600 text-white text-xs font-bold px-3 py-1 shadow-sm hover:bg-green-600">
                  <Percent className="w-3 h-3 mr-1" />
                  {discountPercentage} İNDİRİM
                </Badge>
              </div>
            )}

            {/* Image */}
            <div className="relative h-56 bg-gray-100">
              {offering.image && !imageError ? (
                <Image
                  src={offering.image}
                  alt={offering.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="text-4xl text-gray-400">🍽️</div>
                </div>
              )}
            </div>
          </div>

          <CardContent className="p-6">
            {/* Title and Category */}
            <div className="mb-4">
              <h3 className="font-bold text-xl text-gray-900 line-clamp-1 mb-2">
                {offering.name}
              </h3>
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="text-xs font-medium px-2 py-1 border-gray-300 text-gray-600"
                >
                  {offering.category.name}
                </Badge>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="w-3 h-3 mr-1" />
                  {offering.organization.locationName}
                </div>
              </div>
            </div>

            {offering.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                {offering.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-green-600">
                    ₺{offering.price.toFixed(2)}
                  </span>
                  {offering.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ₺{offering.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                <Package className="w-4 h-4 mr-1" />
                <span className="font-medium">{offering.stock} adet</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {offering.name}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {offering.category.name} • {offering.organization.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
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
                <div className="text-6xl text-gray-400">🍽️</div>
              </div>
            )}
          </div>

          {/* Description */}
          {offering.description && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Açıklama</h4>
              <p className="text-gray-600 leading-relaxed">
                {offering.description}
              </p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Building2 className="w-4 h-4 mr-2" />
                Restoran
              </div>
              <p className="font-medium text-gray-900">
                {offering.organization.name}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <MapPin className="w-4 h-4 mr-2" />
                Konum
              </div>
              <p className="font-medium text-gray-900">
                {offering.organization.locationName}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Package className="w-4 h-4 mr-2" />
                Stok
              </div>
              <p className="font-medium text-gray-900">{offering.stock} adet</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Clock className="w-4 h-4 mr-2" />
                Bekleme Süresi
              </div>
              <p className="font-medium text-gray-900">
                {offering.bookingDuration} dakika
              </p>
            </div>
          </div>

          {/* Expiration Date */}
          {offering.expirationDate && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center text-sm text-blue-600 mb-1">
                <Calendar className="w-4 h-4 mr-2" />
                Son Geçerlilik Tarihi
              </div>
              <p className="font-medium text-blue-900">
                {new Date(offering.expirationDate).toLocaleString("tr-TR")}
              </p>
            </div>
          )}

          {/* Price Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex flex-col">
                  <span className="text-4xl font-bold text-green-600">
                    ₺{offering.price.toFixed(2)}
                  </span>
                  {offering.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ₺{offering.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                {discountPercentage > 0 && (
                  <Badge className="bg-green-600 text-white text-sm font-bold px-3 py-1">
                    <Percent className="w-4 h-4 mr-1" />
                    {discountPercentage} İNDİRİM
                  </Badge>
                )}
              </div>
            </div>

            <Button
              onClick={() => {
                onBook?.(offering);
                setDialogOpen(false);
              }}
              disabled={offering.stock === 0}
              className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg rounded-lg"
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
      </DialogContent>
    </Dialog>
  );
};
