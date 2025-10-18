import axios from "axios";
import { Prisma } from "@/lib/generated/prisma";

type CategoriesResult = {
  categories: Prisma.CategoryGetPayload<Record<string, never>>[];
};

export type { CategoriesResult };

export const categoriesService = {
  async getCategories(): Promise<CategoriesResult> {
    const response = await axios.get<CategoriesResult>("/api/categories");
    return response.data;
  },
};
