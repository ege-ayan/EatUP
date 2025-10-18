"use client";

import Image from "next/image";
import { useState } from "react";
import {
  MapPin,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  MoreVertical,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Booking } from "../_services/bookings-service";
import { useUpdateBookingStatus } from "../_hooks/use-bookings";
import { toast } from "sonner";

interface BookingCardProps {
  booking: Booking;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "COMPLETED":
      return "bg-green-100 text-green-800 border-green-200";
    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PENDING":
      return <Clock className="w-3 h-3" />;
    case "CONFIRMED":
      return <CheckCircle className="w-3 h-3" />;
    case "COMPLETED":
      return <CheckCircle className="w-3 h-3" />;
    case "CANCELLED":
      return <XCircle className="w-3 h-3" />;
    default:
      return <Clock className="w-3 h-3" />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "PENDING":
      return "Bekleniyor";
    case "CONFIRMED":
      return "Onaylandı";
    case "COMPLETED":
      return "Tamamlandı";
    case "CANCELLED":
      return "İptal Edildi";
    default:
      return status;
  }
};

export const BookingCard = ({ booking }: BookingCardProps) => {
  const [imageError, setImageError] = useState(false);
  const updateBookingMutation = useUpdateBookingStatus();

  const handleStatusUpdate = async (status: "COMPLETED" | "CANCELLED") => {
    try {
      await updateBookingMutation.mutateAsync({
        bookingId: booking.id,
        status,
      });

      toast.success(
        status === "COMPLETED"
          ? "Rezervasyon tamamlandı!"
          : "Rezervasyon iptal edildi!"
      );
    } catch {
      toast.error("Durum güncellenemedi");
    }
  };

  const canUpdateStatus =
    booking.status === "CONFIRMED" || booking.status === "PENDING";

  return (
    <Card className="overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge
            className={`${getStatusColor(
              booking.status
            )} font-medium px-3 py-1 text-xs`}
          >
            {getStatusIcon(booking.status)}
            <span className="ml-1">{getStatusText(booking.status)}</span>
          </Badge>
        </div>

        {/* Actions Menu */}
        {canUpdateStatus && (
          <div className="absolute top-3 right-3 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {booking.status === "CONFIRMED" && (
                  <DropdownMenuItem
                    onClick={() => handleStatusUpdate("COMPLETED")}
                    className="text-green-600"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Tamamlandı Olarak İşaretle
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => handleStatusUpdate("CANCELLED")}
                  className="text-red-600"
                >
                  <X className="w-4 h-4 mr-2" />
                  İptal Et
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Image */}
        <div className="relative h-48 bg-gray-100">
          {booking.offering.image && !imageError ? (
            <Image
              src={booking.offering.image}
              alt={booking.offering.name}
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
      </div>

      <CardContent className="p-4">
        {/* Offering Info */}
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-1">
            {booking.offering.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building2 className="w-4 h-4" />
            {booking.offering.organization.name}
          </div>
        </div>

        {/* Booking Details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Package className="w-4 h-4 mr-2" />
            <span>{booking.quantity} adet</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="truncate">
              {booking.offering.organization.locationName}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-green-600">
              ₺{booking.totalPrice.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(booking.createdAt).toLocaleDateString("tr-TR")}
            </span>
          </div>

          {booking.pickupTime && (
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">Alış Zamanı</div>
              <div className="text-sm font-medium text-gray-900">
                {new Date(booking.pickupTime).toLocaleString("tr-TR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
