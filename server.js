require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate recipes from ingredients
app.post('/api/recipes', async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    
    const prompt = `Given these ingredients: ${ingredients}

Generate exactly 5 quick recipes in JSON format:
1. A 5-minute ultra-lazy version
2. A 10-minute quick version
3. A 1-pan version
4. A no-cook version (if possible)
5. A creative fusion version

Format as JSON array with: name, time, difficulty, ingredients, steps (max 5 steps, keep them SHORT and simple)

Example format:
[
  {
    "name": "Recipe Name",
    "time": "5 min",
    "difficulty": "lazy",
    "type": "5-minute",
    "ingredients": ["item1", "item2"],
    "steps": ["step1", "step2"]
  }
]

Keep it simple and practical. No fancy ingredients. Make recipes creative but easy.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const recipes = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    
    res.json({ recipes });
  } catch (error) {
    console.error('Error details:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: 'Failed to generate recipes', details: error.message });
  }
});

// Voice guidance endpoint
app.post('/api/voice-guide', async (req, res) => {
  try {
    const { recipe, step } = req.body;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    
    const prompt = `You are a friendly cooking assistant. Guide the user through this step in a conversational, encouraging way (2-3 sentences max):

Recipe: ${recipe.name}
Current Step: ${recipe.steps[step]}

Be casual, helpful, and motivating. Add a tip if relevant.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const guidance = response.text();
    
    res.json({ guidance });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate guidance' });
  }
});

app.listen(PORT, () => {
  console.log(`🍳 Lazy Meal Decider running on http://localhost:${PORT}`);
});
