"use client";

import { useState, useMemo } from "react";
import { Clock, CheckCircle, History, Package, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingCard } from "./_components/booking-card";
import { BookingCardShimmer } from "./_components/booking-card-shimmer";
import { useOrganizationBookings } from "./_hooks/use-organization-bookings";

export default function OrganizationBookingsPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");

  // Active bookings (PENDING, CONFIRMED)
  const {
    data: activeBookingsData,
    isLoading: isLoadingActive,
    fetchNextPage: fetchNextActive,
    hasNextPage: hasNextActive,
    isFetchingNextPage: isFetchingNextActive,
  } = useOrganizationBookings(undefined, 50);

  // Completed bookings
  const {
    data: completedBookingsData,
    isLoading: isLoadingCompleted,
    fetchNextPage: fetchNextCompleted,
    hasNextPage: hasNextCompleted,
    isFetchingNextPage: isFetchingNextCompleted,
  } = useOrganizationBookings("COMPLETED", 50);

  const allBookings =
    activeBookingsData?.pages.flatMap((page) => page.bookings) || [];
  const completedBookings =
    completedBookingsData?.pages.flatMap((page) => page.bookings) || [];

  // Filter active bookings to exclude COMPLETED and CANCELLED
  const activeBookings = allBookings.filter(
    (booking) => booking.status === "PENDING" || booking.status === "CONFIRMED"
  );

  // Search filter function
  const filterBookings = (bookings: typeof allBookings) => {
    if (!searchQuery.trim()) return bookings;

    const query = searchQuery.toLowerCase();
    return bookings.filter((booking) => {
      const customerName =
        `${booking.user.name} ${booking.user.surname}`.toLowerCase();
      const customerEmail = booking.user.email.toLowerCase();
      const offeringName = booking.offering.name.toLowerCase();

      return (
        customerName.includes(query) ||
        customerEmail.includes(query) ||
        offeringName.includes(query)
      );
    });
  };

  // Apply search filter
  const filteredActiveBookings = useMemo(
    () => filterBookings(activeBookings),
    [activeBookings, searchQuery]
  );

  const filteredCompletedBookings = useMemo(
    () => filterBookings(completedBookings),
    [completedBookings, searchQuery]
  );

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Rezervasyonlar
          </h1>
          <p className="text-gray-600">
            İşletmenize ait rezervasyonları görüntüleyin ve yönetin
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Müşteri adı, email veya ürün adı ile ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-500 mt-2">
              <span className="font-medium">
                {filteredActiveBookings.length +
                  filteredCompletedBookings.length}
              </span>{" "}
              sonuç bulundu
            </p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Aktif Rezervasyonlar
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {filteredActiveBookings.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Teslim Edilenler</p>
                <p className="text-3xl font-bold text-green-600">
                  {filteredCompletedBookings.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Toplam</p>
                <p className="text-3xl font-bold text-gray-900">
                  {filteredActiveBookings.length +
                    filteredCompletedBookings.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Aktif ({filteredActiveBookings.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Teslim Edilenler ({filteredCompletedBookings.length})
            </TabsTrigger>
          </TabsList>

          {/* Active Bookings Tab */}
          <TabsContent value="active" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Aktif Rezervasyonlar
              </h2>
            </div>

            {isLoadingActive ? (
              <div className="space-y-4 max-h-[calc(100vh-550px)] overflow-y-auto pr-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <BookingCardShimmer key={index} />
                ))}
              </div>
            ) : filteredActiveBookings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery
                    ? "Sonuç bulunamadı"
                    : "Henüz aktif rezervasyon yok"}
                </h3>
                <p className="text-gray-600">
                  {searchQuery
                    ? "Farklı bir arama terimi deneyin."
                    : "Müşteriler rezervasyon yaptıkça burada görünecek."}
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-[calc(100vh-550px)] overflow-y-auto pr-2">
                  {filteredActiveBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>

                {!searchQuery && hasNextActive && (
                  <div className="text-center mt-6">
                    <Button
                      onClick={() => fetchNextActive()}
                      disabled={isFetchingNextActive}
                      variant="outline"
                    >
                      {isFetchingNextActive
                        ? "Yükleniyor..."
                        : "Daha Fazla Göster"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Completed Bookings Tab */}
          <TabsContent value="completed" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Teslim Edilenler
              </h2>
            </div>

            {isLoadingCompleted ? (
              <div className="space-y-4 max-h-[calc(100vh-550px)] overflow-y-auto pr-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <BookingCardShimmer key={index} />
                ))}
              </div>
            ) : filteredCompletedBookings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery
                    ? "Sonuç bulunamadı"
                    : "Henüz teslim edilen rezervasyon yok"}
                </h3>
                <p className="text-gray-600">
                  {searchQuery
                    ? "Farklı bir arama terimi deneyin."
                    : "Teslim ettiğiniz rezervasyonlar burada görünecek."}
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-[calc(100vh-550px)] overflow-y-auto pr-2">
                  {filteredCompletedBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>

                {!searchQuery && hasNextCompleted && (
                  <div className="text-center mt-6">
                    <Button
                      onClick={() => fetchNextCompleted()}
                      disabled={isFetchingNextCompleted}
                      variant="outline"
                    >
                      {isFetchingNextCompleted
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
