import Image from "next/image";
import { useState } from "react";
import { MapPin, Package, Percent, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { OfferingDialog } from "./offering-dialog";
import { Offering } from "../_services/offerings-service";

interface OfferingCardProps {
  offering: Offering;
}

export const OfferingCard = ({ offering }: OfferingCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const discountPercentage = offering.originalPrice
    ? Math.round(
        ((offering.originalPrice - offering.price) / offering.originalPrice) *
          100
      )
    : 0;

  return (
    <OfferingDialog
      offering={offering}
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      trigger={
        <Card className="overflow-hidden bg-white border border-gray-200 shadow-md cursor-pointer hover:shadow-lg transition-all duration-200 group">
          <div className="relative">
            <div className="absolute top-3 left-3 z-10">
              <Badge
                variant="secondary"
                className="bg-white/95 text-gray-700 text-xs font-medium px-2 py-1 shadow-sm"
              >
                <Building2 className="w-3 h-3 mr-1" />
                {offering.organization.name}
              </Badge>
            </div>

            {discountPercentage > 0 && (
              <div className="absolute top-3 right-3 z-10">
                <Badge className="bg-green-600 text-white text-xs font-bold px-2 py-1 shadow-sm">
                  <Percent className="w-3 h-3 mr-1" />
                  {discountPercentage}% OFF
                </Badge>
              </div>
            )}

            <div className="relative h-48 bg-gray-100 group-hover:scale-105 transition-transform duration-200">
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

          <CardContent className="p-4">
            <div className="mb-3">
              <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-1">
                {offering.name}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  {offering.category.name}
                </Badge>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="w-3 h-3 mr-1" />
                  {offering.organization.locationName}
                </div>
              </div>
            </div>

            {offering.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                {offering.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-green-600">
                  ₺{offering.price.toFixed(2)}
                </span>
                {offering.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ₺{offering.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex items-center text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                <Package className="w-3 h-3 mr-1" />
                {offering.stock} left
              </div>
            </div>
          </CardContent>
        </Card>
      }
    />
  );
};

export const OfferingCardShimmer = () => {
  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden animate-pulse">
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200"></div>

      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>

        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-7 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};
