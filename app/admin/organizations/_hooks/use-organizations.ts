import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { organizationsService } from "../_services/organizations-service";

interface OrganizationsFilter {
  search?: string;
}

export function useOrganizations(filter: OrganizationsFilter = {}) {
  return useQuery({
    queryKey: ["admin-organizations", filter.search],
    queryFn: () => organizationsService.getOrganizations(filter.search),
  });
}

export function useAvailableUsers() {
  return useQuery({
    queryKey: ["admin-organization-users"],
    queryFn: () => organizationsService.getAvailableUsers(),
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: organizationsService.createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-organizations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Organizasyon başarıyla oluşturuldu");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Organizasyon oluşturulamadı");
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: organizationsService.updateOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-organizations"] });
      toast.success("Organizasyon başarıyla güncellendi");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Organizasyon güncellenemedi");
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: organizationsService.deleteOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-organizations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Organizasyon başarıyla silindi");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Organizasyon silinemedi");
    },
  });
}

export function useAssignUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      organizationId,
    }: {
      userId: string;
      organizationId: string;
    }) => organizationsService.assignUser(userId, organizationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-organizations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-organization-users"] });
      toast.success("Kullanıcı başarıyla atandı");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Kullanıcı atanamadı");
    },
  });
}

export function useRemoveUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: organizationsService.removeUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-organizations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-organization-users"] });
      toast.success("Kullanıcı başarıyla ayrıldı");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Kullanıcı ayrılamadı");
    },
  });
}
