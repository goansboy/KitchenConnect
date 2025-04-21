const mongoose = require('mongoose');

const ShoppingListItemSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    checked: { type: Boolean, default: false }
});

module.exports = mongoose.model('ShoppingListItem', ShoppingListItemSchema);
