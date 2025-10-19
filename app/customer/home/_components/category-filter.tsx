import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "../_hooks/use-categories";

interface CategoryFilterProps {
  selectedCategory?: string;
  onCategoryChange: (categoryId: string | undefined) => void;
}

export const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  const { data: categoriesResponse, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger className="w-full lg:w-[170px]">
          <SelectValue placeholder="Yükleniyor..." />
        </SelectTrigger>
      </Select>
    );
  }

  if (error || !categoriesResponse) {
    return (
      <Select disabled>
        <SelectTrigger className="w-full lg:w-[170px]">
          <SelectValue placeholder="Yüklenemedi" />
        </SelectTrigger>
      </Select>
    );
  }

  const categories = categoriesResponse.categories;

  return (
    <Select
      value={selectedCategory || "all"}
      onValueChange={(value) =>
        onCategoryChange(value === "all" ? undefined : value)
      }
    >
      <SelectTrigger className="w-full lg:w-[170px]">
        <SelectValue placeholder="Kategori" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tüm Kategoriler</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
