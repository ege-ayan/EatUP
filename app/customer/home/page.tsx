"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryFilter } from "./_components/category-filter";
import { OfferingCard } from "./_components/offering-card";
import { OfferingCardShimmer } from "./_components/offering-card";
import { useOfferings } from "./_hooks/use-offerings";
import { useCategories } from "./_hooks/use-categories";
import { Offering } from "./_services/offerings-service";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();

  const {
    data: offeringsPages,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOfferings(selectedCategory);

  const { data: categoriesResponse } = useCategories();
  const categories = categoriesResponse?.categories || [];

  const selectedCategoryName = selectedCategory
    ? categories.find((cat) => cat.id === selectedCategory)?.name
    : undefined;

  const handleBookOffering = (offering: Offering) => {
    console.log("Booking offering:", offering);
    alert(`Rezervasyon için "${offering.name}" seçildi!`);
  };

  const allOfferings =
    offeringsPages?.pages.flatMap((page) => page.offerings || []) || [];

  const filteredOfferings = allOfferings;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Kategoriler</h2>
          </div>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {selectedCategoryName
                ? `${selectedCategoryName} Yemekleri`
                : "Tüm Yemekler"}
            </h3>
            {!isLoading && (
              <p className="text-gray-600 mt-1">
                {filteredOfferings.length} sonuç bulundu
              </p>
            )}
          </div>
        </div>

        {error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">Yemekler yüklenemedi</div>
            <Button onClick={() => window.location.reload()}>
              Tekrar Dene
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <OfferingCardShimmer key={index} />
                ))
              ) : filteredOfferings.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500 mb-4">
                    Bu kategoride yemek bulunamadı
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCategory(undefined)}
                  >
                    Tüm Kategorileri Göster
                  </Button>
                </div>
              ) : (
                filteredOfferings.map((offering) => (
                  <OfferingCard
                    key={offering.id}
                    offering={offering}
                    onBook={handleBookOffering}
                  />
                ))
              )}
            </div>

            {hasNextPage && !isLoading && (
              <div className="text-center">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  variant="outline"
                  size="lg"
                >
                  {isFetchingNextPage ? "Yükleniyor..." : "Daha Fazla Göster"}
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
