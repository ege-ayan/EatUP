"use client";

import { useState } from "react";
import { History, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingStatus } from "@/generated/prisma";

import { BookingCard } from "./_components/booking-card";
import { BookingCardShimmer } from "./_components/booking-card-shimmer";
import { useBookings } from "./_hooks/use-bookings";

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("current");

  // Fetch all bookings (we'll filter client-side)
  const {
    data: bookingsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBookings(undefined, 50);

  const allBookings =
    bookingsData?.pages.flatMap((page) => page.bookings) || [];

  const now = new Date();

  // Filter bookings based on status and pickup time
  const activeBookings = allBookings.filter((booking) => {
    // Include PENDING and CONFIRMED bookings
    if (
      booking.status === BookingStatus.PENDING ||
      booking.status === BookingStatus.CONFIRMED
    ) {
      return true;
    }

    // Include CANCELLED bookings if pickup time hasn't passed
    if (
      booking.status === BookingStatus.CANCELLED &&
      booking.pickupTime &&
      new Date(booking.pickupTime) > now
    ) {
      return true;
    }

    return false;
  });

  const pastBookings = allBookings.filter((booking) => {
    // Include COMPLETED bookings
    if (booking.status === BookingStatus.COMPLETED) {
      return true;
    }

    // Include CANCELLED bookings only if pickup time has passed
    if (
      booking.status === BookingStatus.CANCELLED &&
      booking.pickupTime &&
      new Date(booking.pickupTime) <= now
    ) {
      return true;
    }

    // Include CANCELLED bookings without pickup time
    if (booking.status === BookingStatus.CANCELLED && !booking.pickupTime) {
      return true;
    }

    return false;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Rezervasyonlarım
          </h1>
          <p className="text-gray-600">
            Rezervasyonlarınızı görüntüleyin ve yönetin
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full sm:w-96 grid-cols-2 mb-8">
            <TabsTrigger
              value="current"
              className="flex items-center gap-2 text-sm"
            >
              <Clock className="w-4 h-4" />
              Mevcut ({activeBookings.length})
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="flex items-center gap-2 text-sm"
            >
              <History className="w-4 h-4" />
              Geçmiş ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Mevcut Rezervasyonlar
              </h2>
            </div>

            {isLoading ? (
              <div className="space-y-4 max-h-[calc(100vh-350px)] overflow-y-auto pr-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <BookingCardShimmer key={index} />
                ))}
              </div>
            ) : activeBookings.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Henüz aktif rezervasyonunuz yok
                </h3>
                <p className="text-gray-600">
                  Yeni bir rezervasyon yapmak için ana sayfaya gidin.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-[calc(100vh-350px)] overflow-y-auto pr-2">
                  {activeBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>

                {hasNextPage && (
                  <div className="text-center mt-6">
                    <Button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      variant="outline"
                    >
                      {isFetchingNextPage
                        ? "Yükleniyor..."
                        : "Daha Fazla Göster"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Geçmiş Rezervasyonlar
              </h2>
            </div>

            {isLoading ? (
              <div className="space-y-4 max-h-[calc(100vh-350px)] overflow-y-auto pr-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <BookingCardShimmer key={index} />
                ))}
              </div>
            ) : pastBookings.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Henüz geçmiş rezervasyonunuz yok
                </h3>
                <p className="text-gray-600">
                  Tamamlanan veya iptal edilen rezervasyonlarınız burada
                  görünecek.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-[calc(100vh-350px)] overflow-y-auto pr-2">
                  {pastBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>

                {hasNextPage && (
                  <div className="text-center mt-6">
                    <Button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      variant="outline"
                    >
                      {isFetchingNextPage
                        ? "Yükleniyor..."
                        : "Daha Fazla Göster"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
