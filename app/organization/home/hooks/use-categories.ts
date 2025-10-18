import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Prisma } from "@/lib/generated/prisma";

type CategoriesResult = {
  categories: Prisma.CategoryGetPayload<Record<string, never>>[];
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<CategoriesResult> => {
      const response = await axios.get<CategoriesResult>("/api/categories");
      return response.data;
    },
  });
};
