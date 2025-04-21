const mongoose = require('mongoose');

const DaySchema = new mongoose.Schema({
    day: { type: String, required: true }, // e.g., 'Monday'
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
});

const RecipeScheduleSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    schedule: [DaySchema]
});

module.exports = mongoose.model('RecipeSchedule', RecipeScheduleSchema);
