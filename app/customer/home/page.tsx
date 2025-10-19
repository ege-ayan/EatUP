"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, SortAsc, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryFilter } from "./_components/category-filter";
import { OfferingCard } from "./_components/offering-card";
import { OfferingCardShimmer } from "./_components/offering-card";
import { useOfferings } from "./_hooks/use-offerings";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: offeringsPages,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOfferings(
    selectedCategory,
    undefined,
    debouncedSearch,
    sortBy,
    sortOrder
  );

  const allOfferings =
    offeringsPages?.pages.flatMap((page) => page.offerings || []) || [];

  const filteredOfferings = allOfferings;

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    const option = { threshold: 0 };

    const observer = new IntersectionObserver(handleObserver, option);
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver]);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="sticky top-0 z-40 bg-gray-50 border-b border-gray-200 ">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 lg:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Yemek, kategori veya restoran ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>

              <div className="flex gap-2 flex-1">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Tarihe Göre</SelectItem>
                    <SelectItem value="expirationDate">
                      Son Geçerlilik
                    </SelectItem>
                    <SelectItem value="price">Fiyata Göre</SelectItem>
                    <SelectItem value="name">İsme Göre</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="flex-shrink-0"
                >
                  {sortOrder === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Yemek, kategori veya restoran ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Tarihe Göre</SelectItem>
                  <SelectItem value="expirationDate">Son Geçerlilik</SelectItem>
                  <SelectItem value="price">Fiyata Göre</SelectItem>
                  <SelectItem value="name">İsme Göre</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="flex-shrink-0"
              >
                {sortOrder === "asc" ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <main className="max-w-7xl mx-auto px-4 py-8">
          {error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">Yemekler yüklenemedi</div>
              <Button onClick={() => window.location.reload()}>
                Tekrar Dene
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr mb-8">
                {isLoading ? (
                  Array.from({ length: 9 }).map((_, index) => (
                    <OfferingCardShimmer key={index} />
                  ))
                ) : filteredOfferings.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <div className="text-gray-900 font-medium text-lg mb-2">
                      Hiçbir sonuç bulunamadı
                    </div>
                    <div className="text-gray-500 mb-4">
                      Farklı bir arama terimi veya kategori deneyin
                    </div>
                    {(selectedCategory || debouncedSearch) && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedCategory(undefined);
                          setSearchQuery("");
                        }}
                      >
                        Filtreleri Temizle
                      </Button>
                    )}
                  </div>
                ) : (
                  filteredOfferings.map((offering, index) => (
                    <OfferingCard
                      key={offering.id}
                      offering={offering}
                      priority={index < 6}
                    />
                  ))
                )}
              </div>

              {hasNextPage && !isLoading && (
                <div ref={loadMoreRef} className="text-center py-8">
                  {isFetchingNextPage && (
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      <span>Daha fazla yükleniyor...</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
