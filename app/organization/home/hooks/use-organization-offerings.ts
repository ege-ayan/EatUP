import { useQuery } from "@tanstack/react-query";
import { offeringsService } from "@/app/organization/services/offerings-service";

export const useOrganizationOfferings = (organizationId: string) => {
  return useQuery({
    queryKey: ["organization-offerings", organizationId],
    queryFn: () => offeringsService.getOrganizationOfferings(organizationId),
    enabled: !!organizationId,
    staleTime: 1000 * 60 * 5,
  });
};
