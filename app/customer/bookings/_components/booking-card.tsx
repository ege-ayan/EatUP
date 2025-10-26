"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BookingStatus } from "@/generated/prisma";
import { Booking } from "../_services/bookings-service";
import { BookingDetailDialog } from "./booking-detail-dialog";

interface BookingCardProps {
  booking: Booking;
}

const getStatusColor = (status: BookingStatus, isPastPending: boolean) => {
  // If it's a past pending booking, show as not picked up (red)
  if (isPastPending) {
    return "bg-red-100 text-red-800 border-red-200";
  }

  switch (status) {
    case BookingStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case BookingStatus.CONFIRMED:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case BookingStatus.COMPLETED:
      return "bg-green-100 text-green-800 border-green-200";
    case BookingStatus.CANCELLED:
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status: BookingStatus, isPastPending: boolean) => {
  // If it's a past pending booking, show X icon
  if (isPastPending) {
    return <XCircle className="w-4 h-4" />;
  }

  switch (status) {
    case BookingStatus.PENDING:
      return <Clock className="w-4 h-4" />;
    case BookingStatus.CONFIRMED:
      return <CheckCircle2 className="w-4 h-4" />;
    case BookingStatus.COMPLETED:
      return <CheckCircle2 className="w-4 h-4" />;
    case BookingStatus.CANCELLED:
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getStatusText = (status: BookingStatus, isPastPending: boolean) => {
  // If it's a past pending booking, show as not picked up
  if (isPastPending) {
    return "Teslim Alınmadı";
  }

  switch (status) {
    case BookingStatus.PENDING:
      return "Bekleniyor";
    case BookingStatus.CONFIRMED:
      return "Onaylandı";
    case BookingStatus.COMPLETED:
      return "Tamamlandı";
    case BookingStatus.CANCELLED:
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

  const totalMinutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let text = "";
  let color = "";

  if (totalMinutes < 15) {
    // Less than 15 minutes - RED
    text = `${totalMinutes} dakika kaldı`;
    color = "text-red-600";
  } else if (totalMinutes < 30) {
    // 15-30 minutes - YELLOW
    text = `${totalMinutes} dakika kaldı`;
    color = "text-yellow-600";
  } else if (totalMinutes < 60) {
    // 30-60 minutes - BLUE
    text = `${totalMinutes} dakika kaldı`;
    color = "text-blue-600";
  } else {
    // More than 1 hour - BLUE
    text =
      hours > 1
        ? `${hours} saat ${minutes} dakika kaldı`
        : `${hours} saat ${minutes} dakika kaldı`;
    color = "text-blue-600";
  }

  return { text, color, expired: false };
};

export const BookingCard = ({ booking }: BookingCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState<{
    text: string;
    color: string;
    expired: boolean;
  } | null>(null);

  // Check if this is a past pending booking (pending/confirmed but deadline passed)
  const now = new Date();
  const isPastPending = Boolean(
    (booking.status === BookingStatus.PENDING ||
      booking.status === BookingStatus.CONFIRMED) &&
      booking.pickupTime &&
      new Date(booking.pickupTime) <= now
  );

  useEffect(() => {
    if (
      booking.pickupTime &&
      (booking.status === BookingStatus.PENDING ||
        booking.status === BookingStatus.CONFIRMED)
    ) {
      const updateTime = () => {
        setRemainingTime(calculateRemainingTime(new Date(booking.pickupTime!)));
      };

      updateTime();
      const interval = setInterval(updateTime, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [booking.pickupTime, booking.status]);

  return (
    <>
      <Card
        className="overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group p-0"
        onClick={() => setDetailOpen(true)}
      >
        <div className="flex flex-col sm:flex-row sm:h-[200px] h-full relative">
          {/* Status Badge - Top Right */}
          <div className="absolute top-3 right-3 z-10">
            <Badge
              className={`${getStatusColor(
                booking.status,
                isPastPending
              )} font-medium px-3 py-1.5 text-sm shadow-md`}
            >
              {getStatusIcon(booking.status, isPastPending)}
              <span className="ml-1.5">
                {getStatusText(booking.status, isPastPending)}
              </span>
            </Badge>
          </div>

          {/* Image Section */}
          <div className="relative w-full sm:w-48 h-48 sm:h-full bg-gray-100 flex-shrink-0">
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
          </div>

          {/* Content Section */}
          <div className="flex-1 p-5">
            <div className="mb-4">
              <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                {booking.offering.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Building2 className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">
                  {booking.offering.organization.name}
                </span>
              </div>

              {/* Remaining Time Badge */}
              {remainingTime && !remainingTime.expired && (
                <Badge
                  className={`${
                    remainingTime.color === "text-red-600"
                      ? "bg-red-100 text-red-800 border-red-200"
                      : remainingTime.color === "text-yellow-600"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                        : "bg-blue-100 text-blue-800 border-blue-200"
                  } font-medium px-2 py-1 text-xs flex items-center gap-1 w-fit`}
                >
                  <Clock className="w-3 h-3" />
                  {remainingTime.text}
                </Badge>
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
