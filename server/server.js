const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const recipeRoutes = require('./routes/recipes');
const userRoutes = require('./routes/users');
const shoppingListRoutes = require('./routes/shoppingList');
const scheduleRoutes = require('./routes/schedule');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shopping-list', shoppingListRoutes);
app.use('/api/schedule', scheduleRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
    res.send('API is working! 🧑‍🍳');
});

// Start server
app.listen(PORT, () => {
    console.log(`🌐 Server running on http://localhost:${PORT}`);
});
