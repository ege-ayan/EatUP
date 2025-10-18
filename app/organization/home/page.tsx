"use client";

import { useUserStore } from "@/components/providers/user-store";
import { useOrganizationOfferings } from "./hooks/use-organization-offerings";
import { OfferingsTable } from "./components/offerings-table";
import { AddOfferingModal } from "./components/add-offering-modal";
import Navbar from "@/components/common/navbar";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function OrganizationHomePage() {
  const user = useUserStore((state) => state.user);

  // For now, we'll use a hardcoded organization ID since we don't have
  // the organization relationship set up in the user store
  // In a real app, you'd get this from the user.organizationId
  const organizationId = user?.id || "";

  const {
    data: offeringsResponse,
    isLoading,
    error,
    deleteOffering,
  } = useOrganizationOfferings(organizationId);

  const offerings = offeringsResponse?.offerings || [];

  const handleDeleteOffering = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "Ürünü silmek istediğinize emin misiniz?",
      text: `"${name}" ürünü kalıcı olarak silinecektir.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Evet, sil",
      cancelButtonText: "İptal",
    });

    if (result.isConfirmed) {
      try {
        await deleteOffering(id);
        toast.success("Ürün başarıyla silindi");
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Ürün silinirken bir hata oluştu");
      }
    }
  };

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
            <OfferingsTable
              offerings={offerings}
              isLoading={isLoading}
              onDeleteOffering={handleDeleteOffering}
            />
          )}
        </div>
      </main>
    </div>
  );
}
