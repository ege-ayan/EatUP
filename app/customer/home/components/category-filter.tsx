import { Button } from "@/components/ui/button";
import { CategoryFilterShimmer } from "./loading-shimmer";
import { useCategories } from "../hooks/use-offerings";

interface CategoryFilterProps {
  selectedCategory?: string; // This is now a category ID
  onCategoryChange: (categoryId: string | undefined) => void;
}

export const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  const { data: categoriesResponse, isLoading, error } = useCategories();

  if (isLoading) {
    return <CategoryFilterShimmer />;
  }

  if (error || !categoriesResponse?.success) {
    return (
      <div className="text-center text-red-500 py-4">
        Kategoriler yüklenemedi
      </div>
    );
  }

  const categories = categoriesResponse.categories;

  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
      <Button
        variant={selectedCategory === undefined ? "default" : "outline"}
        size="sm"
        onClick={() => onCategoryChange(undefined)}
        className="flex-shrink-0 rounded-full"
      >
        Tümü
      </Button>

      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          className="flex-shrink-0 rounded-full"
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};
