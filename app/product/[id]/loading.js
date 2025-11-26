export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-stone-100">
      {/* Header Skeleton */}
      <header className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg animate-pulse h-10 w-40"></div>
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full animate-pulse"></div>
            <div className="bg-white bg-opacity-20 rounded h-8 w-32 animate-pulse"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image Skeleton */}
            <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-stone-100 animate-pulse">
              <div className="absolute top-6 left-6 bg-amber-200 rounded-full h-10 w-32 animate-pulse"></div>
              <div className="absolute top-6 right-6 bg-yellow-200 rounded-full h-10 w-24 animate-pulse"></div>
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-6xl text-amber-300 animate-bounce">🤠</div>
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="p-8 lg:p-12">
              <div className="h-full flex flex-col">
                {/* Title and Price Skeleton */}
                <div className="mb-6">
                  <div className="bg-amber-100 rounded h-12 w-3/4 mb-4 animate-pulse"></div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-amber-200 rounded h-16 w-32 animate-pulse"></div>
                    <div className="bg-amber-100 rounded-full h-12 w-24 animate-pulse"></div>
                  </div>
                </div>

                {/* Description Skeleton */}
                <div className="flex-grow mb-8">
                  <div className="bg-amber-100 rounded h-6 w-48 mb-4 animate-pulse"></div>
                  <div className="space-y-3">
                    <div className="bg-stone-100 rounded h-4 w-full animate-pulse"></div>
                    <div className="bg-stone-100 rounded h-4 w-5/6 animate-pulse"></div>
                    <div className="bg-stone-100 rounded h-4 w-4/5 animate-pulse"></div>
                  </div>
                </div>

                {/* Details Grid Skeleton */}
                <div className="mb-8">
                  <div className="bg-amber-100 rounded h-6 w-40 mb-4 animate-pulse"></div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                        <div className="bg-amber-100 rounded h-4 w-20 mb-2 animate-pulse"></div>
                        <div className="bg-amber-200 rounded h-6 w-24 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features Skeleton */}
                <div className="mb-8">
                  <div className="bg-amber-100 rounded h-6 w-32 mb-4 animate-pulse"></div>
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-green-200 rounded animate-pulse"></div>
                        <div className="bg-stone-100 rounded h-4 w-48 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Buttons Skeleton */}
                <div className="space-y-4">
                  <div className="bg-amber-200 rounded-lg h-14 animate-pulse"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-stone-100 border-2 border-stone-200 rounded-lg h-12 animate-pulse"></div>
                    <div className="bg-stone-200 rounded-lg h-12 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards Skeleton */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-lg border border-amber-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full mx-auto mb-4 animate-pulse"></div>
                <div className="bg-amber-100 rounded h-5 w-24 mx-auto mb-2 animate-pulse"></div>
                <div className="bg-stone-100 rounded h-4 w-32 mx-auto animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}