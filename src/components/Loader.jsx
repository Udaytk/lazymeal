function Loader() {
  return (
    <div className="text-center py-8 sm:py-12 lg:py-16 px-4">
      {/* Glassmorphic Loading Container */}
      <div className="glass-strong rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 max-w-6xl mx-auto shadow-2xl">
        {/* Animated cooking icons */}
        <div className="flex gap-4 sm:gap-6 justify-center mb-6 sm:mb-8 text-5xl sm:text-6xl lg:text-7xl">
          <span className="animate-bounce" style={{ animationDelay: '0ms' }}>🍳</span>
          <span className="animate-bounce" style={{ animationDelay: '150ms' }}>🥘</span>
          <span className="animate-bounce" style={{ animationDelay: '300ms' }}>🍜</span>
        </div>
        
        <p className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6 drop-shadow-lg">
          Finding lazy recipes...
        </p>

        {/* Progress bar */}
        <div className="glass rounded-full h-2 sm:h-3 overflow-hidden mb-6 sm:mb-8">
          <div className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-pulse rounded-full"></div>
        </div>
        
        {/* Skeleton Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 mt-8 max-w-[1800px] mx-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="glass rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-5 animate-pulse h-[280px] sm:h-[300px] flex flex-col"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="h-5 sm:h-6 glass-strong rounded-xl mb-2 w-3/4"></div>
              <div className="h-4 glass-strong rounded-lg mb-3 w-1/2"></div>
              <div className="space-y-2 mb-3 flex-grow">
                <div className="h-12 glass-strong rounded-lg"></div>
                <div className="h-12 glass-strong rounded-lg"></div>
              </div>
              <div className="h-8 glass-strong rounded-lg mb-3 w-full"></div>
              <div className="h-10 glass-strong rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Loader;
