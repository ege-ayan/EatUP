"use client";

import { useState } from "react";
import {
  useOrganizations,
  useAvailableUsers,
  useCreateOrganization,
  useUpdateOrganization,
  useDeleteOrganization,
  useAssignUser,
  useRemoveUser,
} from "../_hooks/use-organizations";
import { Organization } from "../_services/organizations-service";
import { Building2, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import OrganizationFormDialog from "./organization-form-dialog";
import OrganizationsTable from "./organizations-table";
import OrganizationDetailsDialog from "./organization-details-dialog";
import AddUserDialog from "./add-user-dialog";

export default function OrganizationsClient() {
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    phone: "",
    email: "",
    website: "",
  });

  const { data: availableUsersData } = useAvailableUsers();
  const { data: orgsData, isLoading } = useOrganizations({ search });

  const createOrgMutation = useCreateOrganization();
  const updateOrgMutation = useUpdateOrganization();
  const deleteOrgMutation = useDeleteOrganization();
  const assignUserMutation = useAssignUser();
  const removeUserMutation = useRemoveUser();

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      description: "",
      phone: "",
      email: "",
      website: "",
    });
  };

  const handleCreateOrg = () => {
    createOrgMutation.mutate(formData, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        resetForm();
      },
    });
  };

  const handleEditOrg = () => {
    if (!selectedOrg) return;
    updateOrgMutation.mutate(
      {
        id: selectedOrg.id,
        ...formData,
      },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setSelectedOrg(null);
          resetForm();
        },
      }
    );
  };

  const handleDeleteOrg = async (org: Organization) => {
    const result = await Swal.fire({
      title: "Organizasyonu silmek istediğinize emin misiniz?",
      text: `${org.name} ve tüm verileri kalıcı olarak silinecektir.`,
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Evet",
      cancelButtonText: "İptal",
    });

    if (result.isConfirmed) {
      deleteOrgMutation.mutate(org.id);
    }
  };

  const openEditModal = (org: Organization) => {
    setSelectedOrg(org);
    setFormData({
      name: org.name,
      location: org.location,
      description: org.description || "",
      phone: org.phone || "",
      email: org.email || "",
      website: org.website || "",
    });
    setIsEditModalOpen(true);
  };

  const openDetailsModal = (org: Organization) => {
    setSelectedOrg(org);
    setIsDetailsModalOpen(true);
  };

  const handleAssignUser = () => {
    if (!selectedOrg || !selectedUserId) return;
    assignUserMutation.mutate(
      {
        userId: selectedUserId,
        organizationId: selectedOrg.id,
      },
      {
        onSuccess: () => {
          setIsAddUserModalOpen(false);
          setSelectedUserId("");
        },
      }
    );
  };

  const handleRemoveUser = async (user: {
    id: string;
    name: string;
    surname: string;
  }) => {
    const currentOrg = selectedOrg;
    setIsDetailsModalOpen(false);

    const result = await Swal.fire({
      title: "Kullanıcıyı ayırmak istediğinize emin misiniz?",
      text: `${user.name} ${user.surname} bu organizasyondan ayrılacak.`,
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Evet",
      cancelButtonText: "İptal",
    });

    if (result.isConfirmed) {
      removeUserMutation.mutate(user.id, {
        onSettled: () => {
          setSelectedOrg(currentOrg);
          setIsDetailsModalOpen(true);
        },
      });
    } else {
      setSelectedOrg(currentOrg);
      setIsDetailsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="h-8 w-8 text-orange-400" />
              <div>
                <h1 className="text-3xl font-bold text-orange-400">
                  Organizasyon Yönetimi
                </h1>
                <p className="text-gray-600">
                  Tüm organizasyonları görüntüleyin ve yönetin
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setIsCreateModalOpen(true);
              }}
              className="flex items-center gap-2 bg-orange-400 hover:bg-orange-500"
            >
              <Plus className="h-4 w-4" />
              Yeni Organizasyon
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center gap-2 relative">
              <Search className="absolute left-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Organizasyon adı veya konum ile ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 flex-1"
              />
            </div>
          </div>

          <div className="p-6">
            <OrganizationsTable
              organizations={orgsData?.organizations || []}
              isLoading={isLoading}
              onEdit={openEditModal}
              onDelete={handleDeleteOrg}
              onViewDetails={openDetailsModal}
            />
          </div>

          {orgsData && (
            <div className="p-4 border-t bg-gray-50">
              <p className="text-sm text-gray-600">
                Toplam {orgsData.total} organizasyon
              </p>
            </div>
          )}
        </div>
      </main>

      <OrganizationFormDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Yeni Organizasyon Oluştur"
        description="Sisteme yeni bir organizasyon ekleyin"
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleCreateOrg}
        isPending={createOrgMutation.isPending}
        submitText="Oluştur"
      />

      <OrganizationFormDialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Organizasyonu Düzenle"
        description="Organizasyon bilgilerini güncelleyin"
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleEditOrg}
        isPending={updateOrgMutation.isPending}
        submitText="Güncelle"
      />

      <OrganizationDetailsDialog
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        organization={selectedOrg}
        onAddUser={() => {
          setIsDetailsModalOpen(false);
          setIsAddUserModalOpen(true);
        }}
        onRemoveUser={handleRemoveUser}
      />

      <AddUserDialog
        open={isAddUserModalOpen}
        onOpenChange={setIsAddUserModalOpen}
        organizationName={selectedOrg?.name || ""}
        availableUsers={availableUsersData?.users || []}
        selectedUserId={selectedUserId}
        onUserIdChange={setSelectedUserId}
        onSubmit={handleAssignUser}
        isPending={assignUserMutation.isPending}
      />
    </div>
  );
}
