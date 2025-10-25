"use client";

import {
  User,
  Package,
  Clock,
  Calendar,
  Mail,
  Tag,
  CheckCircle2,
  XCircle,
  Hash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrganizationBooking } from "../_services/bookings-service";

interface BookingDetailDialogProps {
  booking: OrganizationBooking;
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
      return <Clock className="w-5 h-5" />;
    case "CONFIRMED":
      return <CheckCircle2 className="w-5 h-5" />;
    case "COMPLETED":
      return <CheckCircle2 className="w-5 h-5" />;
    case "CANCELLED":
      return <XCircle className="w-5 h-5" />;
    default:
      return <Clock className="w-5 h-5" />;
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

export const BookingDetailDialog = ({
  booking,
  open,
  onOpenChange,
}: BookingDetailDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">
              Rezervasyon Detayları
            </DialogTitle>
            <Badge
              className={`${getStatusColor(
                booking.status
              )} font-semibold px-4 py-2`}
            >
              {getStatusIcon(booking.status)}
              <span className="ml-2">{getStatusText(booking.status)}</span>
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Customer Information */}
          <div className="bg-blue-50 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Müşteri Bilgileri
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Ad Soyad</p>
                <p className="font-semibold text-gray-900 text-lg">
                  {booking.user.name} {booking.user.surname}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <p className="text-sm text-gray-700">{booking.user.email}</p>
              </div>
            </div>
          </div>

          {/* Offering Information */}
          <div className="bg-gray-50 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Ürün Bilgileri
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Ürün</p>
                <p className="font-semibold text-gray-900 text-lg">
                  {booking.offering.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {booking.offering.category.name}
                </span>
              </div>
            </div>
          </div>

          {/* Booking Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Quantity */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-gray-500" />
                <p className="text-xs text-gray-500">Miktar</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {booking.quantity} adet
              </p>
            </div>

            {/* Total Price */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">Toplam Fiyat</p>
              <p className="text-2xl font-bold text-green-600">
                ₺{booking.totalPrice.toFixed(2)}
              </p>
            </div>

            {/* Reservation Date */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <p className="text-xs text-gray-500">Rezervasyon Tarihi</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(booking.createdAt).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(booking.createdAt).toLocaleTimeString("tr-TR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Pickup Time */}
            {booking.pickupTime && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <p className="text-xs text-gray-500">Son Teslim Alma</p>
                </div>
                <p className="text-sm font-semibold text-orange-600">
                  {new Date(booking.pickupTime).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                  })}
                </p>
                <p className="text-xs text-orange-600 font-medium mt-1">
                  {new Date(booking.pickupTime).toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Booking ID */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-gray-500" />
              <p className="text-xs text-gray-500">Rezervasyon ID</p>
            </div>
            <p className="font-mono text-sm text-gray-700 break-all">
              {booking.id}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
