import RecipeCard from './RecipeCard';

function RecipeGrid({ recipes, onStartCooking }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 animate-fadeIn max-w-[1800px] mx-auto">
      {recipes.map((recipe, index) => (
        <RecipeCard
          key={index}
          recipe={recipe}
          onStartCooking={() => onStartCooking(recipe)}
          delay={index * 100}
        />
      ))}
    </div>
  );
}

export default RecipeGrid;
