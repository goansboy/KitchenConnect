const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const User = require('../models/User');

// Create a new recipe
router.post('/', async (req, res) => {
    try {
        const recipe = new Recipe({
            ...req.body,
            userEmail: req.body.userEmail, 
        });
        await recipe.save();
        res.status(201).json(recipe);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all recipes or filter by user
router.get('/', async (req, res) => {
    try {
        const filter = req.query.userEmail ? { userEmail: req.query.userEmail } : {};
        const recipes = await Recipe.find(filter);
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Clone another user's recipe
router.post('/clone/:id', async (req, res) => {
    try {
        const original = await Recipe.findById(req.params.id).populate('createdBy', 'username email');
        if (!original) return res.status(404).json({ error: 'Original recipe not found' });

        const clone = new Recipe({
            title: original.title,
            description: original.description,
            ingredients: original.ingredients,
            steps: original.steps,
            cookTime: original.cookTime,
            prepTime: original.prepTime,
            servings: original.servings,
            userEmail: req.body.userEmail,
            createdBy: req.body.mongoId,
            originalCreator: {
                username: original.createdBy?.username || '',
                email: original.createdBy?.email || ''
            }
        });

        await clone.save();
        res.status(201).json(clone);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get one recipe (this must come *after* the /clone route)
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'username email');
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
        res.json(recipe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get one recipe
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'username email');
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
        res.json(recipe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a recipe
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Recipe.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Recipe not found' });
        res.json({ message: 'Recipe deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a recipe
router.put('/:id', async (req, res) => {
    try {
        const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updated) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /feed/:userId - Get recipes from followed users
router.get('/feed/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        const following = user.following;

        const recipes = await Recipe.find({ createdBy: { $in: user.following } })
            .sort({ createdAt: -1 })
            .populate('createdBy', 'username');



        res.json(recipes);
    } catch (error) {
        console.error('Error getting feed recipes:', error);
        res.status(500).json({ error: 'Server error fetching feed.' });
    }
});



module.exports = router;


