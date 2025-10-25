"use client";

import { useState } from "react";
import {
  User,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { OrganizationBooking } from "../_services/bookings-service";
import { useUpdateBookingStatus } from "../_hooks/use-organization-bookings";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { BookingDetailDialog } from "./booking-detail-dialog";

interface BookingCardProps {
  booking: OrganizationBooking;
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
      return "Beklemede";
    case "CONFIRMED":
      return "Onaylandı";
    case "COMPLETED":
      return "Teslim Edildi";
    case "CANCELLED":
      return "İptal Edildi";
    default:
      return status;
  }
};

export const BookingCard = ({ booking }: BookingCardProps) => {
  const [detailOpen, setDetailOpen] = useState(false);
  const [isDelivering, setIsDelivering] = useState(false);
  const updateBookingMutation = useUpdateBookingStatus();

  const handleMarkAsDelivered = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: "Teslim Edildi Olarak İşaretle",
      html: `
        <div style="text-align: left;">
          <p><strong>${booking.user.name} ${booking.user.surname}</strong> adlı müşterinin</p>
          <p><strong>${booking.offering.name}</strong> (${booking.quantity} adet) rezervasyonunu</p>
          <p>teslim edildi olarak işaretlemek istediğinize emin misiniz?</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Evet, Teslim Edildi",
      cancelButtonText: "Vazgeç",
    });

    if (!result.isConfirmed) return;

    setIsDelivering(true);
    try {
      await updateBookingMutation.mutateAsync({
        bookingId: booking.id,
        status: "COMPLETED",
      });
      toast.success("Rezervasyon teslim edildi olarak işaretlendi!");
    } catch (error) {
      console.error(error);
      toast.error("İşlem başarısız oldu");
    } finally {
      setIsDelivering(false);
    }
  };

  const canMarkAsDelivered =
    booking.status === "PENDING" || booking.status === "CONFIRMED";

  return (
    <>
      <Card
        className="overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
        onClick={() => setDetailOpen(true)}
      >
        <div className="p-5">
          <div className="flex items-center justify-between gap-4">
            {/* Left Section - Customer & Product */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Customer Avatar */}
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate group-hover:text-green-600 transition-colors">
                  {booking.user.name} {booking.user.surname}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  {booking.offering.name}
                </p>
              </div>
            </div>

            {/* Middle Section - Quantity & Price */}
            <div className="flex items-center gap-6 flex-shrink-0">
              <div className="text-center">
                <div className="flex items-center gap-1 text-gray-500 mb-1">
                  <Package className="w-4 h-4" />
                  <span className="text-xs">Miktar</span>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {booking.quantity}
                </p>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Toplam</p>
                <p className="text-lg font-bold text-green-600">
                  ₺{booking.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Right Section - Status & Action */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Badge
                className={`${getStatusColor(
                  booking.status
                )} font-medium px-3 py-1.5`}
              >
                {getStatusIcon(booking.status)}
                <span className="ml-1.5">{getStatusText(booking.status)}</span>
              </Badge>

              {canMarkAsDelivered ? (
                <Button
                  onClick={handleMarkAsDelivered}
                  disabled={isDelivering}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isDelivering ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Teslim Et
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetailOpen(true);
                  }}
                >
                  Detaylar
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
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
