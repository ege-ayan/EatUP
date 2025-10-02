export const OfferingCardShimmer = () => {
  return (
    <div className="bg-white border-0 shadow-sm rounded-lg overflow-hidden animate-pulse">
      {/* Image shimmer */}
      <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200"></div>

      <div className="p-6 space-y-4">
        {/* Title shimmer */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Description shimmer */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* Price and stock shimmer */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-8 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-24"></div>
        </div>

        {/* Button shimmer */}
        <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
      </div>
    </div>
  );
};

export const CategoryFilterShimmer = () => {
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
