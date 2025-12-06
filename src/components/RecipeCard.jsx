import { useState, useEffect } from 'react';

function RecipeCard({ recipe, onStartCooking, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const getTypeBadge = (type) => {
    const badges = {
      '5-minute': { emoji: '⚡', label: '5-Min', color: 'from-yellow-400 to-orange-500' },
      '1-pan': { emoji: '🍳', label: '1-Pan', color: 'from-purple-400 to-pink-500' },
      'normal-quick': { emoji: '🔥', label: 'Quick', color: 'from-blue-400 to-cyan-500' },
      'no-cook': { emoji: '❄️', label: 'No-Cook', color: 'from-cyan-400 to-blue-500' },
      'fusion': { emoji: '✨', label: 'Fusion', color: 'from-pink-400 to-rose-500' }
    };
    return badges[type] || badges['normal-quick'];
  };

  const badge = getTypeBadge(recipe.type);

  return (
    <div
      className={`glass-card rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-5 flex flex-col h-full transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Compact Header */}
      <div className="mb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 flex-1 group-hover:text-purple-600 transition-colors leading-tight line-clamp-2">
            {recipe.name}
          </h3>
          <div className={`bg-gradient-to-r ${badge.color} text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1 flex-shrink-0`}>
            <span>{badge.emoji}</span>
            <span className="hidden sm:inline text-xs">{badge.label}</span>
          </div>
        </div>
        
        {/* Compact Time Badge */}
        <div className="inline-flex items-center gap-1 glass px-2 sm:px-3 py-1 rounded-full">
          <span className="text-sm">⏱️</span>
          <span className="text-xs font-semibold text-gray-700">{recipe.time}</span>
        </div>
      </div>

      {/* Compact Steps - Show only 2 */}
      <div className="mb-3 flex-grow">
        <h4 className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Quick Steps</h4>
        <div className="space-y-1.5">
          {recipe.steps.slice(0, 2).map((step, idx) => (
            <div key={idx} className="flex items-start gap-2 glass rounded-lg p-2 hover:bg-white/60 transition-colors">
              <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">
                {idx + 1}
              </div>
              <p className="text-xs text-gray-700 leading-snug line-clamp-2">
                {step}
              </p>
            </div>
          ))}
          {recipe.steps.length > 2 && (
            <p className="text-gray-400 italic text-[10px] text-center pt-1">
              +{recipe.steps.length - 2} more steps
            </p>
          )}
        </div>
      </div>

      {/* Compact Ingredients Badge */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div className="mb-3">
          <div className="glass rounded-lg px-2 py-1.5 flex items-center justify-between">
            <span className="text-xs text-gray-600 font-semibold">
              🥘 {recipe.ingredients.length} ingredients
            </span>
            {recipe.difficulty && (
              <span className="text-[10px] text-gray-500 bg-white/50 px-2 py-0.5 rounded-full">
                {recipe.difficulty}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Compact Button */}
      <button
        onClick={onStartCooking}
        className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 hover:from-green-500 hover:via-emerald-600 hover:to-teal-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden group mt-auto"
      >
        <span className="relative z-10 flex items-center justify-center gap-1.5">
          <span className="text-base sm:text-lg">🎤</span>
          <span>Start Cooking</span>
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
      </button>
    </div>
  );
}

export default RecipeCard;
