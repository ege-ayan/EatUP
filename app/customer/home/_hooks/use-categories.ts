import { useQuery } from "@tanstack/react-query";
import {
  categoriesService,
  CategoriesResult,
} from "../_services/categories-service";

export const useCategories = () => {
  return useQuery<CategoriesResult>({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getCategories(),
  });
};
