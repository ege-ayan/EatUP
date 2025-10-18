import { Button } from "@/components/ui/button";
import { useCategories } from "../_hooks/use-categories";

const CategoryFilterShimmer = () => {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-10 bg-gray-200 rounded-full w-20 flex-shrink-0 animate-pulse"
        ></div>
      ))}
    </div>
  );
};

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
    return <CategoryFilterShimmer />;
  }

  if (error || !categoriesResponse) {
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
