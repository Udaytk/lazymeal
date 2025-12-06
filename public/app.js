let currentRecipe = null;
let currentStepIndex = 0;

const elements = {
  ingredients: document.getElementById('ingredients'),
  findRecipes: document.getElementById('findRecipes'),
  loading: document.getElementById('loading'),
  recipes: document.getElementById('recipes'),
  cookingMode: document.getElementById('cookingMode'),
  cookingTitle: document.getElementById('cookingTitle'),
  currentStep: document.getElementById('currentStep'),
  totalSteps: document.getElementById('totalSteps'),
  stepText: document.getElementById('stepText'),
  voiceGuidance: document.getElementById('voiceGuidance'),
  prevStep: document.getElementById('prevStep'),
  nextStep: document.getElementById('nextStep'),
  speakStep: document.getElementById('speakStep'),
  closeCooking: document.getElementById('closeCooking')
};

// Find recipes
elements.findRecipes.addEventListener('click', findRecipes);
elements.ingredients.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') findRecipes();
});

async function findRecipes() {
  const ingredients = elements.ingredients.value.trim();
  if (!ingredients) return;

  elements.loading.classList.remove('hidden');
  elements.recipes.innerHTML = '';

  try {
    const response = await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients })
    });

    const data = await response.json();
    displayRecipes(data.recipes);
  } catch (error) {
    console.error('Error:', error);
    elements.recipes.innerHTML = '<p style="color: white; text-align: center;">Failed to fetch recipes. Try again!</p>';
  } finally {
    elements.loading.classList.add('hidden');
  }
}

function displayRecipes(recipes) {
  elements.recipes.innerHTML = recipes.map((recipe, index) => `
    <div class="recipe-card">
      <div class="recipe-header">
        <div class="recipe-name">${recipe.name}</div>
        <div class="recipe-meta">
          <span class="badge ${recipe.difficulty}">${recipe.time}</span>
          <span class="badge ${recipe.type === '5-minute' ? 'lazy' : recipe.type === '1-pan' ? 'onepan' : 'quick'}">${recipe.type}</span>
        </div>
      </div>
      
      <div class="recipe-steps">
        <h4>Steps:</h4>
        <ol>
          ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
        </ol>
      </div>
      
      <button class="start-cooking" onclick="startCooking(${index})">
        🎤 Start Cooking Mode
      </button>
    </div>
  `).join('');

  window.recipesData = recipes;
}

function startCooking(recipeIndex) {
  currentRecipe = window.recipesData[recipeIndex];
  currentStepIndex = 0;
  
  elements.cookingTitle.textContent = currentRecipe.name;
  elements.totalSteps.textContent = currentRecipe.steps.length;
  elements.cookingMode.classList.remove('hidden');
  elements.voiceGuidance.innerHTML = '';
  
  updateStep();
  window.scrollTo({ top: elements.cookingMode.offsetTop - 20, behavior: 'smooth' });
}

function updateStep() {
  elements.currentStep.textContent = currentStepIndex + 1;
  elements.stepText.textContent = currentRecipe.steps[currentStepIndex];
  elements.voiceGuidance.innerHTML = '';
  
  elements.prevStep.disabled = currentStepIndex === 0;
  elements.nextStep.disabled = currentStepIndex === currentRecipe.steps.length - 1;
  
  if (currentStepIndex === currentRecipe.steps.length - 1) {
    elements.nextStep.textContent = '✓ Done!';
  } else {
    elements.nextStep.textContent = 'Next →';
  }
}

// Navigation
elements.prevStep.addEventListener('click', () => {
  if (currentStepIndex > 0) {
    currentStepIndex--;
    updateStep();
  }
});

elements.nextStep.addEventListener('click', () => {
  if (currentStepIndex < currentRecipe.steps.length - 1) {
    currentStepIndex++;
    updateStep();
  } else {
    elements.cookingMode.classList.add('hidden');
    alert('🎉 Meal complete! Enjoy your lazy cooking!');
  }
});

elements.closeCooking.addEventListener('click', () => {
  elements.cookingMode.classList.add('hidden');
});

// Voice guidance
elements.speakStep.addEventListener('click', async () => {
  elements.speakStep.disabled = true;
  elements.speakStep.textContent = '🎤 Loading...';
  elements.voiceGuidance.innerHTML = '<p>Getting voice guidance...</p>';

  try {
    const response = await fetch('/api/voice-guide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        recipe: currentRecipe, 
        step: currentStepIndex 
      })
    });

    const data = await response.json();
    elements.voiceGuidance.innerHTML = `<p>🎙️ ${data.guidance}</p>`;
    
    // Text-to-speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(data.guidance);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  } catch (error) {
    console.error('Error:', error);
    elements.voiceGuidance.innerHTML = '<p>Failed to get guidance. Try again!</p>';
  } finally {
    elements.speakStep.disabled = false;
    elements.speakStep.textContent = '🎤 Guide Me';
  }
});
