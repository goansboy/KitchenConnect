const express = require('express');
const router = express.Router();
const RecipeSchedule = require('../models/RecipeSchedule');
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const schedule = await RecipeSchedule.findOne({ user: userId }).populate('schedule.recipes');
        res.json(schedule || { user: userId, schedule: [] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/add', async (req, res) => {
    const { userId, day, recipeId } = req.body;

    if (!userId || !day || !recipeId) {
        return res.status(400).json({ error: 'Missing userId, day, or recipeId' });
    }

    try {
        let schedule = await RecipeSchedule.findOne({ user: userId });

        if (!schedule) {
            schedule = new RecipeSchedule({ user: userId, schedule: [] });
        }

        let dayEntry = schedule.schedule.find((d) => d.day === day);

        if (!dayEntry) {
            dayEntry = { day, recipes: [] };
            schedule.schedule.push(dayEntry);
        }

        if (!dayEntry.recipes.includes(recipeId)) {
            dayEntry.recipes.push(recipeId);
        }

        await schedule.save();
        res.status(200).json(schedule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/remove', async (req, res) => {
    const { userId, day, recipeId } = req.body;

    if (!userId || !day || !recipeId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const schedule = await RecipeSchedule.findOne({ user: userId });
        if (!schedule) return res.status(404).json({ error: 'Schedule not found' });

        const dayEntry = schedule.schedule.find(d => d.day === day);
        if (!dayEntry) return res.status(404).json({ error: 'Day not found in schedule' });

        dayEntry.recipes = dayEntry.recipes.filter(id => id.toString() !== recipeId);
        await schedule.save();

        res.json({ message: 'Recipe removed from schedule', schedule });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;