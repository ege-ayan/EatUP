"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  MoreVertical,
  Check,
  X,
  Calendar,
  AlertCircle,
  ChevronRight,
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
import { BookingDetailDialog } from "./booking-detail-dialog";
import Swal from "sweetalert2";

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
      return <Clock className="w-4 h-4" />;
    case "CONFIRMED":
      return <CheckCircle2 className="w-4 h-4" />;
    case "COMPLETED":
      return <CheckCircle2 className="w-4 h-4" />;
    case "CANCELLED":
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
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

const calculateRemainingTime = (pickupTime: Date) => {
  const now = new Date();
  const pickup = new Date(pickupTime);
  const diff = pickup.getTime() - now.getTime();

  if (diff <= 0) {
    return { text: "Süresi doldu", color: "text-red-600", expired: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours < 1) {
    return {
      text: `${minutes} dakika kaldı`,
      color: "text-red-600",
      expired: false,
    };
  } else if (hours < 3) {
    return {
      text: `${hours} saat ${minutes} dakika kaldı`,
      color: "text-orange-600",
      expired: false,
    };
  } else {
    return {
      text: `${hours} saat kaldı`,
      color: "text-green-600",
      expired: false,
    };
  }
};

export const BookingCard = ({ booking }: BookingCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState<{
    text: string;
    color: string;
    expired: boolean;
  } | null>(null);
  const updateBookingMutation = useUpdateBookingStatus();

  useEffect(() => {
    if (
      booking.pickupTime &&
      (booking.status === "PENDING" || booking.status === "CONFIRMED")
    ) {
      const updateTime = () => {
        setRemainingTime(calculateRemainingTime(new Date(booking.pickupTime!)));
      };

      updateTime();
      const interval = setInterval(updateTime, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [booking.pickupTime, booking.status]);

  const handleStatusUpdate = async (
    status: "COMPLETED" | "CANCELLED",
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Prevent card click

    // Show confirmation for cancellation
    if (status === "CANCELLED") {
      const result = await Swal.fire({
        title: "Rezervasyonu İptal Et",
        html: `<strong>${booking.offering.name}</strong> rezervasyonunu iptal etmek istediğinize emin misiniz?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Evet, İptal Et",
        cancelButtonText: "Vazgeç",
      });

      if (!result.isConfirmed) {
        return;
      }
    }

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
    <>
      <Card
        className="overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group"
        onClick={() => setDetailOpen(true)}
      >
        <div className="flex flex-col sm:flex-row sm:h-[200px]">
          {/* Image Section */}
          <div className="relative w-full sm:w-48 h-48 sm:h-[200px] bg-gray-100 flex-shrink-0">
            {booking.offering.image && !imageError ? (
              <Image
                src={booking.offering.image}
                alt={booking.offering.name}
                fill
                sizes="(max-width: 640px) 100vw, 192px"
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-6xl">🍽️</div>
              </div>
            )}

            {/* Status Badge Overlay */}
            <div className="absolute top-3 left-3">
              <Badge
                className={`${getStatusColor(
                  booking.status
                )} font-medium px-3 py-1.5 text-sm`}
              >
                {getStatusIcon(booking.status)}
                <span className="ml-1.5">{getStatusText(booking.status)}</span>
              </Badge>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  {booking.offering.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Building2 className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">
                    {booking.offering.organization.name}
                  </span>
                </div>
              </div>

              {/* Actions Menu */}
              {canUpdateStatus && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 ml-2"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {booking.status === "CONFIRMED" && (
                      <DropdownMenuItem
                        onClick={(e) => handleStatusUpdate("COMPLETED", e)}
                        className="text-green-600"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Tamamlandı Olarak İşaretle
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={(e) => handleStatusUpdate("CANCELLED", e)}
                      className="text-red-600"
                    >
                      <X className="w-4 h-4 mr-2" />
                      İptal Et
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {/* Quantity */}
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Miktar</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {booking.quantity} adet
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-xs text-gray-500">Toplam</p>
                  <p className="text-lg font-bold text-green-600">
                    ₺{booking.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Created Date */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Oluşturma</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(booking.createdAt).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>

              {/* Pickup Deadline */}
              {booking.pickupTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Son Teslim</p>
                    <p className="text-sm font-semibold text-orange-600">
                      {new Date(booking.pickupTime).toLocaleDateString(
                        "tr-TR",
                        {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Remaining Time or Pickup Time */}
            <div className="flex items-center justify-between pt-4 border-t">
              {remainingTime && !remainingTime.expired ? (
                <div className="flex items-center gap-2">
                  <AlertCircle
                    className={`w-5 h-5 ${remainingTime.color} animate-pulse`}
                  />
                  <div>
                    <p className="text-xs text-gray-500">Kalan Süre</p>
                    <p className={`text-sm font-bold ${remainingTime.color}`}>
                      {remainingTime.text}
                    </p>
                  </div>
                </div>
              ) : booking.pickupTime ? (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Teslim Alma</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(booking.pickupTime).toLocaleString("tr-TR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ) : (
                <div />
              )}

              {/* View Details */}
              <Button
                variant="ghost"
                size="sm"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setDetailOpen(true);
                }}
              >
                Detaylar
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <BookingDetailDialog
        booking={booking}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  );
};
