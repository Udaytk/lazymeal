function Header({ ingredients, setIngredients, onFindRecipes, loading }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      onFindRecipes();
    }
  };

  return (
    <div className="text-center mb-12 sm:mb-16 lg:mb-20">
      {/* Floating Logo */}
      <div className="mb-6 sm:mb-8 animate-float">
        <div className="inline-block glass-strong rounded-full p-4 sm:p-6 shadow-2xl">
          <span className="text-6xl sm:text-7xl lg:text-8xl">🍳</span>
        </div>
      </div>

      {/* Title with Glassmorphic Background */}
      <div className="mb-8 sm:mb-10 px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-3 sm:mb-4 drop-shadow-lg">
          Lazy Meal Decider
        </h1>
        <div className="inline-block glass px-4 sm:px-6 py-2 sm:py-3 rounded-full">
          <p className="text-lg sm:text-xl lg:text-2xl text-white font-medium">
            ✨ Zero thinking required ✨
          </p>
        </div>
      </div>

      {/* Glassmorphic Input Container */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="🥚 Eggs, 🍞 Bread, 🧀 Cheese..."
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 border-white/50 focus:outline-none focus:ring-4 focus:ring-white/40 focus:border-white transition-all shadow-lg placeholder:text-gray-400"
              disabled={loading}
            />
            <button
              onClick={onFindRecipes}
              disabled={loading}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all relative overflow-hidden group whitespace-nowrap"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Thinking...
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    Find Recipes
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>
          </div>

          {/* Helper Text */}
          <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 text-white/90 text-xs sm:text-sm lg:text-base px-2">
            <span className="text-lg sm:text-xl">💡</span>
            <p className="text-center">Just dump whatever you see in your kitchen. I'll figure it out.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
