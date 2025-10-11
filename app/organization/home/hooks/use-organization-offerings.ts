import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { offeringsService } from "@/app/organization/home/services/offerings-service";

export const useOrganizationOfferings = (organizationId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["organization-offerings", organizationId],
    queryFn: () => offeringsService.getOrganizationOfferings(organizationId),
    enabled: !!organizationId,
  });

  const deleteOfferingMutation = useMutation({
    mutationFn: (id: string) => offeringsService.deleteOffering(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-offerings"] });
    },
  });

  return {
    ...query,
    deleteOffering: deleteOfferingMutation.mutateAsync,
  };
};
