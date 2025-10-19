import Image from "next/image";
import { useState } from "react";
import { Package, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { OfferingDialog } from "./offering-dialog";
import { Offering } from "../_services/offerings-service";

interface OfferingCardProps {
  offering: Offering;
  priority?: boolean;
}

export const OfferingCard = ({
  offering,
  priority = false,
}: OfferingCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

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

  return (
    <OfferingDialog
      offering={offering}
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      trigger={
        <Card className="h-full flex flex-col overflow-hidden bg-white border border-gray-200 shadow-md cursor-pointer transition-all duration-300 group p-0">
          <div className="relative">
            <div className="absolute top-3 left-3 z-10">
              <Badge
                variant="default"
                className="bg-orange-500 text-white text-xs font-semibold px-2.5 py-1 shadow-md"
              >
                {offering.category.name}
              </Badge>
            </div>

            {discountPercentage > 0 && (
              <div className="absolute top-3 right-3 z-10">
                <Badge
                  variant="default"
                  className="bg-green-600 text-white text-xs font-bold px-2.5 py-1 shadow-md"
                >
                  %{discountPercentage} İNDİRİM
                </Badge>
              </div>
            )}

            <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
              <div className="group-hover:scale-105 transition-transform duration-500 h-full w-full relative">
                <Image
                  src={offering.image ?? "/images/placeholder.jpg"}
                  alt={offering.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={priority}
                />
              </div>
            </div>
          </div>

          <CardContent className="p-5 flex-1 flex flex-col">
            <div className="mb-3">
              <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-1.5">
                {offering.name}
              </h3>
              <div className="flex items-center text-sm text-gray-600">
                <Store className="w-3.5 h-3.5 mr-1.5" />
                <span className="line-clamp-1">
                  {offering.organization.name}
                </span>
              </div>
            </div>

            <div className="flex items-end justify-between pt-2 border-t border-gray-100">
              <div className="flex flex-col h-[60px] justify-end">
                {offering.originalPrice && (
                  <span className="text-sm text-gray-400 line-through mb-0.5">
                    ₺{offering.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-2xl font-bold text-green-600">
                  ₺{offering.price.toFixed(2)}
                </span>
              </div>

              <div
                className={`flex items-center text-xs text-white px-2.5 py-1.5 rounded-md font-medium shadow-sm ${getStockColor(
                  offering.stock
                )}`}
              >
                <Package className="w-3.5 h-3.5 mr-1" />
                {offering.stock} adet
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
    <div className="h-full flex flex-col bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden animate-pulse transform scale-[1.02]">
      <div className="relative w-full h-60 bg-gradient-to-br from-gray-100 to-gray-200"></div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="space-y-2 mb-3">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="space-y-1.5 h-[60px] flex flex-col justify-end">
            <div className="h-3 bg-gray-200 rounded w-12"></div>
            <div className="h-7 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};
