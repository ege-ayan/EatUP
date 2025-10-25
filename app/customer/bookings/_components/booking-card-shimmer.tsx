export const BookingCardShimmer = () => {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden animate-pulse">
      <div className="flex flex-col sm:flex-row sm:h-[200px] h-full">
        {/* Image Section */}
        <div className="relative w-full sm:w-48 h-48 sm:h-full bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0" />

        {/* Content Section */}
        <div className="flex-1 p-5 space-y-4">
          {/* Title and Organization */}
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-5 bg-gray-200 rounded w-32"></div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-12"></div>
              <div className="h-5 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-14"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-12"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
