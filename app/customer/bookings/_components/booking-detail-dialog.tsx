"use client";

import Image from "next/image";
import Link from "next/link";
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
  MapPin,
  ExternalLink,
  X as XIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BookingStatus } from "@/generated/prisma";
import { Booking } from "../_services/bookings-service";
import { useUpdateBookingStatus } from "../_hooks/use-bookings";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface BookingDetailDialogProps {
  booking: Booking;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
    return <XCircle className="w-5 h-5" />;
  }

  switch (status) {
    case BookingStatus.PENDING:
      return <Clock className="w-5 h-5" />;
    case BookingStatus.CONFIRMED:
      return <CheckCircle2 className="w-5 h-5" />;
    case BookingStatus.COMPLETED:
      return <CheckCircle2 className="w-5 h-5" />;
    case BookingStatus.CANCELLED:
      return <XCircle className="w-5 h-5" />;
    default:
      return <Clock className="w-5 h-5" />;
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

export const BookingDetailDialog = ({
  booking,
  open,
  onOpenChange,
}: BookingDetailDialogProps) => {
  const [imageError, setImageError] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const updateBookingMutation = useUpdateBookingStatus();

  // Check if this is a past pending booking (pending/confirmed but deadline passed)
  const now = new Date();
  const isPastPending = Boolean(
    (booking.status === BookingStatus.PENDING ||
      booking.status === BookingStatus.CONFIRMED) &&
      booking.pickupTime &&
      new Date(booking.pickupTime) <= now
  );

  const canCancel =
    (booking.status === BookingStatus.PENDING ||
      booking.status === BookingStatus.CONFIRMED) &&
    !isPastPending; // Cannot cancel if deadline has passed

  const handleCancel = async () => {
    // Close dialog temporarily to show SweetAlert
    onOpenChange(false);

    const result = await Swal.fire({
      title: "Rezervasyonu İptal Et",
      html: `<strong>${booking.offering.name}</strong> rezervasyonunu iptal etmek istediğinize emin misiniz?`,
      icon: "warning",
      reverseButtons: true,
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Evet",
      cancelButtonText: "Vazgeç",
    });

    if (!result.isConfirmed) {
      onOpenChange(true);
      return;
    }

    setIsCancelling(true);
    try {
      await updateBookingMutation.mutateAsync({
        bookingId: booking.id,
        status: "CANCELLED",
      });
      toast.success("Rezervasyon iptal edildi!");
    } catch {
      toast.error("Rezervasyon iptal edilemedi");
      // Reopen dialog on error
      onOpenChange(true);
    } finally {
      setIsCancelling(false);
    }
  };

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

          {/* Status Badge Overlay - Top Left */}
          <div className="absolute top-4 left-4">
            <Badge
              className={`${getStatusColor(
                booking.status,
                isPastPending
              )} font-semibold px-4 py-2`}
            >
              {getStatusIcon(booking.status, isPastPending)}
              <span className="ml-2">
                {getStatusText(booking.status, isPastPending)}
              </span>
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
            <DialogDescription>
              Rezervasyon detayları ve durum bilgisi
            </DialogDescription>
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

              {/* Phone and Location in same row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {booking.offering.organization.phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Telefon</p>
                      <a
                        href={`tel:${booking.offering.organization.phone}`}
                        className="font-medium text-blue-600 hover:text-blue-700"
                      >
                        {booking.offering.organization.phone}
                      </a>
                    </div>
                  </div>
                )}

                {booking.offering.organization.location && (
                  <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      booking.offering.organization.location
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <MapPin className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500">Konum</p>
                      <p className="font-medium text-gray-900 group-hover:text-blue-600 truncate">
                        {booking.offering.organization.location}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                  </Link>
                )}
              </div>
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

          {/* Cancel Button */}
          {canCancel && (
            <div className="border-t pt-6 flex justify-end">
              <Button
                onClick={handleCancel}
                disabled={isCancelling}
                variant="destructive"
                className="flex items-center gap-2"
              >
                {isCancelling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    İptal Ediliyor...
                  </>
                ) : (
                  <>
                    <XIcon className="w-4 h-4" />
                    Rezervasyonu İptal Et
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
