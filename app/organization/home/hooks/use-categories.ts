import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { CategoriesResponse } from "@/lib/offerings";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<CategoriesResponse> => {
      const response = await axios.get<CategoriesResponse>("/api/categories");
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });
};
