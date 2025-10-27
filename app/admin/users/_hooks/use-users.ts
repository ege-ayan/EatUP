import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersService } from "../_services/users-service";

interface UsersFilter {
  search?: string;
  role?: string;
}

export function useUsers(filter: UsersFilter = {}) {
  return useQuery({
    queryKey: ["admin-users", filter.search, filter.role],
    queryFn: () => usersService.getUsers(filter.search, filter.role),
  });
}

export function useOrganizations() {
  return useQuery({
    queryKey: ["admin-organizations-list"],
    queryFn: () => usersService.getOrganizations(),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Kullanıcı başarıyla oluşturuldu");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Kullanıcı oluşturulamadı");
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Kullanıcı başarıyla güncellendi");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Kullanıcı güncellenemedi");
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Kullanıcı başarıyla silindi");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Kullanıcı silinemedi");
    },
  });
}
