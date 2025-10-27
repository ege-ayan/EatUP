"use client";

import { useState } from "react";
import {
  useUsers,
  useOrganizations,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "../_hooks/use-users";
import { User } from "../_services/users-service";
import { Users, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Swal from "sweetalert2";
import UserFormDialog from "./user-form-dialog";
import UsersTable from "./users-table";
import { UserRole } from "@/generated/prisma";

export default function UsersClient() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    surname: string;
    email: string;
    password: string;
    role: string;
    organizationId: string;
  }>({
    name: "",
    surname: "",
    email: "",
    password: "",
    role: UserRole.CUSTOMER,
    organizationId: "",
  });

  const { data: usersData, isLoading } = useUsers({ search, role: roleFilter });
  const { data: organizationsData } = useOrganizations();

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const resetForm = () => {
    setFormData({
      name: "",
      surname: "",
      email: "",
      password: "",
      role: UserRole.CUSTOMER,
      organizationId: "",
    });
  };

  const handleCreateUser = () => {
    createUserMutation.mutate(formData, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        resetForm();
      },
    });
  };

  const handleEditUser = () => {
    if (!selectedUser) return;
    const updateData: any = {
      id: selectedUser.id,
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
    };
    if (formData.organizationId !== undefined) {
      updateData.organizationId = formData.organizationId;
    }
    updateUserMutation.mutate(updateData, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
        resetForm();
      },
    });
  };

  const handleDeleteUser = async (user: User) => {
    const result = await Swal.fire({
      title: "Kullanıcıyı silmek istediğinize emin misiniz?",
      text: `${user.name} ${user.surname} kalıcı olarak silinecektir.`,
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Evet",
      cancelButtonText: "İptal",
    });

    if (result.isConfirmed) {
      deleteUserMutation.mutate(user.id);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      surname: user.surname,
      email: user.email,
      password: "",
      role: user.role,
      organizationId: user.organization?.id || "",
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-8 w-8 text-green-800" />
              <div>
                <h1 className="text-3xl font-bold text-green-800">
                  Kullanıcı Yönetimi
                </h1>
                <p className="text-gray-600">
                  Tüm kullanıcıları görüntüleyin ve yönetin
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setIsCreateModalOpen(true);
              }}
              className="flex items-center gap-2 bg-green-800 hover:bg-green-900"
            >
              <Plus className="h-4 w-4" />
              Yeni Kullanıcı
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Ad, soyad veya e-posta ile ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Rol filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tüm Roller</SelectItem>
                  <SelectItem value="CUSTOMER">Müşteri</SelectItem>
                  <SelectItem value="ORGANIZATION">Organizasyon</SelectItem>
                  <SelectItem value="ADMIN">Yönetici</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-6">
            <UsersTable
              users={usersData?.users || []}
              isLoading={isLoading}
              onEdit={openEditModal}
              onDelete={handleDeleteUser}
            />
          </div>

          {usersData && (
            <div className="p-4 border-t bg-gray-50">
              <p className="text-sm text-gray-600">
                Toplam {usersData.total} kullanıcı
              </p>
            </div>
          )}
        </div>
      </main>

      <UserFormDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Yeni Kullanıcı Oluştur"
        description="Sisteme yeni bir kullanıcı ekleyin"
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleCreateUser}
        isPending={createUserMutation.isPending}
        submitText="Oluştur"
        organizations={organizationsData?.organizations || []}
      />

      <UserFormDialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Kullanıcıyı Düzenle"
        description="Kullanıcı bilgilerini güncelleyin"
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleEditUser}
        isPending={updateUserMutation.isPending}
        submitText="Güncelle"
        isEdit={true}
        organizations={organizationsData?.organizations || []}
        userRole={selectedUser?.role}
      />
    </div>
  );
}
