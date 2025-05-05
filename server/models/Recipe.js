const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    ingredients: [String],
    steps: [String],
    cookTime: String,
    prepTime: String,
    servings: Number,
    userEmail: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    originalCreator: {
        username: String,
        email: String
    }
});



module.exports = mongoose.model('Recipe', RecipeSchema);
