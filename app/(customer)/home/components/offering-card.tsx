import Image from "next/image";
import {
  MapPin,
  Package,
  ShoppingCart,
  Percent,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Offering } from "../services/offerings-service";

interface OfferingCardProps {
  offering: Offering;
  onBook?: (offering: Offering) => void;
}

export const OfferingCard = ({ offering, onBook }: OfferingCardProps) => {
  const discountPercentage = offering.originalPrice
    ? Math.round(
        ((offering.originalPrice - offering.price) / offering.originalPrice) *
          100
      )
    : 0;

  return (
    <Card className="overflow-hidden bg-white border border-gray-200 shadow-md">
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
          {offering.image ? (
            <Image
              src={offering.image}
              alt={offering.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
              {offering.category}
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

        <div className="flex items-center justify-between mb-5">
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

        <Button
          onClick={() => onBook?.(offering)}
          disabled={offering.stock === 0}
          className="w-full h-12 bg-green-600 hover:bg-green-600 text-white font-semibold rounded-lg"
        >
          {offering.stock === 0 ? (
            <span className="flex items-center justify-center gap-2">
              <Package className="w-4 h-4" />
              Stokta Yok
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Şimdi Rezerv Et
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
