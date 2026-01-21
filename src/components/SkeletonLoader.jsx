const SkeletonLoader = ({ variant = 'default', className = '' }) => {
  const variants = {
    default: 'h-4 bg-gray-200 rounded',
    productCard: (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse" />
        <div className="h-8 bg-gray-200 rounded w-full animate-pulse" />
      </div>
    ),
    productList: (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
    banner: 'h-48 md:h-64 bg-gray-200 rounded-lg animate-pulse',
    category: (
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
      </div>
    ),
  }

  if (variant === 'default') {
    return <div className={`${variants.default} ${className} animate-pulse`} />
  }

  return <div className={className}>{variants[variant] || variants.default}</div>
}

export default SkeletonLoader


