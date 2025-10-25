export const BookingCardShimmer = () => {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden animate-pulse p-5">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="flex items-center gap-6">
          <div className="text-center space-y-2">
            <div className="h-3 bg-gray-200 rounded w-12"></div>
            <div className="h-6 bg-gray-200 rounded w-8"></div>
          </div>
          <div className="text-center space-y-2">
            <div className="h-3 bg-gray-200 rounded w-12"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <div className="h-8 bg-gray-200 rounded w-24"></div>
          <div className="h-9 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};
