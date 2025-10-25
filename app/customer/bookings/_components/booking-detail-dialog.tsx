"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Package,
  Clock,
  Calendar,
  Building2,
  Phone,
  Tag,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Booking } from "../_services/bookings-service";

interface BookingDetailDialogProps {
  booking: Booking;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export const BookingDetailDialog = ({
  booking,
  open,
  onOpenChange,
}: BookingDetailDialogProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Image Header */}
        <div className="relative h-64 bg-gray-100">
          {booking.offering.image && !imageError ? (
            <Image
              src={booking.offering.image}
              alt={booking.offering.name}
              fill
              sizes="(max-width: 768px) 100vw, 700px"
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-8xl">🍽️</div>
            </div>
          )}

          {/* Status Badge Overlay */}
          <div className="absolute top-4 right-4">
            <Badge
              className={`${getStatusColor(
                booking.status
              )} font-semibold px-4 py-2 text-sm`}
            >
              {getStatusIcon(booking.status)}
              <span className="ml-2">{getStatusText(booking.status)}</span>
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Header */}
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {booking.offering.name}
            </DialogTitle>
          </DialogHeader>

          {/* Booking Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Quantity */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Package className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Miktar</p>
                <p className="text-lg font-semibold text-gray-900">
                  {booking.quantity} adet
                </p>
              </div>
            </div>

            {/* Total Price */}
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
              <Tag className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Toplam Fiyat</p>
                <p className="text-lg font-semibold text-green-600">
                  ₺{booking.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Created At */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Rezervasyon Tarihi</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(booking.createdAt).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(booking.createdAt).toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/* Pickup Time */}
            {booking.pickupTime && (
              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Son Teslim Alma</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(booking.pickupTime).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                  <p className="text-xs text-orange-600 font-medium">
                    {new Date(booking.pickupTime).toLocaleTimeString("tr-TR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Organization Details */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              İşletme Bilgileri
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">İşletme Adı</p>
                  <p className="font-medium text-gray-900">
                    {booking.offering.organization.name}
                  </p>
                </div>
              </div>

              {booking.offering.organization.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Telefon</p>
                    <p className="font-medium text-gray-900">
                      {booking.offering.organization.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          {booking.notes && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Notlar
              </h3>
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-sm text-gray-700">{booking.notes}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
