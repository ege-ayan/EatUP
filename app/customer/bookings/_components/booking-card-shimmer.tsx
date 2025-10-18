export const BookingCardShimmer = () => {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden animate-pulse">
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200"></div>

      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-24"></div>

        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 rounded w-12"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
