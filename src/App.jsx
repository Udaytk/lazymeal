import { useState, useRef } from 'react';
import Header from './components/Header';
import RecipeGrid from './components/RecipeGrid';
import CookingModePanel from './components/CookingModePanel';
import Loader from './components/Loader';
import ErrorBanner from './components/ErrorBanner';

const API_BASE_URL = '/api';

function App() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  
  const recipesRef = useRef(null);

  const handleFindRecipes = async () => {
    if (!ingredients.trim()) {
      setError('Please enter some ingredients first!');
      return;
    }

    setLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: ingredients.trim() }),
      });

      if (!response.ok) throw new Error('Failed to fetch recipes');

      const data = await response.json();
      const parsedRecipes = data.recipes || [];
      
      if (parsedRecipes.length === 0) {
        setError('No recipes found. Try different ingredients!');
      } else {
        setRecipes(parsedRecipes);
        setTimeout(() => {
          recipesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Something broke while talking to the AI. Try again in a bit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 relative z-10">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 lg:py-12">
        <Header
          ingredients={ingredients}
          setIngredients={setIngredients}
          onFindRecipes={handleFindRecipes}
          loading={loading}
        />

        {error && <ErrorBanner message={error} onClose={() => setError(null)} />}
        {loading && <Loader />}
        
        {!loading && recipes.length > 0 && (
          <div ref={recipesRef}>
            <RecipeGrid
              recipes={recipes}
              onStartCooking={(recipe) => {
                setSelectedRecipe(recipe);
                setCurrentStep(0);
              }}
            />
          </div>
        )}

        {selectedRecipe && (
          <CookingModePanel
            recipe={selectedRecipe}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            onClose={() => {
              setSelectedRecipe(null);
              setCurrentStep(0);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
