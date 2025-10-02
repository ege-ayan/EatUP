"use client";

import { useUserStore } from "@/lib/stores/user-store";
import { useOrganizationOfferings } from "./hooks/use-organization-offerings";
import { OfferingsTable } from "./components/offerings-table";
import { AddOfferingModal } from "./components/add-offering-modal";
import Navbar from "@/components/common/navbar";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";

export default function OrganizationHomePage() {
  const user = useUserStore((state) => state.user);

  // For now, we'll use a hardcoded organization ID since we don't have
  // the organization relationship set up in the user store
  // In a real app, you'd get this from the user.organizationId
  const organizationId = user?.id || ""; // This is a placeholder

  const {
    data: offeringsResponse,
    isLoading,
    error,
  } = useOrganizationOfferings(organizationId);

  const offerings = offeringsResponse?.offerings || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center mb-4">
              <Package className="h-6 w-6 text-gray-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Ürün Yönetimi
                </h1>
                <p className="text-gray-600">
                  Ürünlerinizi görüntüleyin ve yönetin
                </p>
              </div>
            </div>
            <AddOfferingModal>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Yeni Ürün Ekle
              </Button>
            </AddOfferingModal>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Ürünleriniz
            </h2>
            <p className="text-gray-600">
              Müşterilerinizin görebileceği tüm ürünlerinizi buradan
              yönetebilirsiniz.
            </p>
          </div>

          {error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">Ürünler yüklenemedi</div>
              <Button onClick={() => window.location.reload()}>
                Tekrar Dene
              </Button>
            </div>
          ) : (
            <OfferingsTable offerings={offerings} isLoading={isLoading} />
          )}
        </div>
      </main>
    </div>
  );
}
