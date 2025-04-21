const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ShoppingListItem = require('../models/ShoppingListItem');

// POST route to add ingredients
router.post('/add', async (req, res) => {
    const { userId, ingredients } = req.body;

    if (!userId || !Array.isArray(ingredients)) {
        return res.status(400).json({ error: 'Missing userId or ingredients' });
    }

    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const updatedItems = [];

        for (const name of ingredients) {
            const existingItem = await ShoppingListItem.findOne({ user: userObjectId, name });

            if (existingItem) {
                existingItem.quantity += 1;
                await existingItem.save();
                updatedItems.push(existingItem);
            } else {
                const newItem = new ShoppingListItem({ user: userObjectId, name });
                await newItem.save();
                updatedItems.push(newItem);
            }
        }

        res.status(200).json(updatedItems);
    } catch (err) {
        console.error('Error adding ingredients:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET route to retrieve shopping list
router.get('/', async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID required' });
    }

    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const list = await ShoppingListItem.find({ user: userObjectId });
        res.json(list);
    } catch (err) {
        console.error('Error fetching shopping list:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PATCH to toggle item checked/unchecked
router.patch('/:id', async (req, res) => {
    try {
        const item = await ShoppingListItem.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        item.checked = !item.checked;
        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update item' });
    }
});

// DELETE to remove item
router.delete('/:id', async (req, res) => {
    try {
        const item = await ShoppingListItem.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

module.exports = router;
