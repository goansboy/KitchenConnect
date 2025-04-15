const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create or update user profile
router.post('/create', async (req, res) => {
    const { uid, email, username } = req.body;
    if (!uid || !email || !username) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        let user = await User.findOne({ uid });

        if (!user) {
            user = new User({ uid, email, username });
        } else {
            user.username = username; // update username if exists
        }

        await user.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Search users by username (case-insensitive)
router.get('/search', async (req, res) => {
    const query = req.query.q;

    try {
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('username email _id followers following');

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Follow a user
router.post('/follow/:id', async (req, res) => {
    const currentUserId = req.body.currentUserId;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
        return res.status(400).json({ error: "You can't follow yourself." });
    }

    try {
        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) {
            return res.status(404).json({ error: "User not found." });
        }

        if (!currentUser.following.includes(targetUserId)) {
            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUserId);

            await currentUser.save();
            await targetUser.save();
        }

        res.status(200).json({ message: 'Followed successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Unfollow a user
router.post('/unfollow/:id', async (req, res) => {
    const currentUserId = req.body.currentUserId;
    const targetUserId = req.params.id;

    try {
        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) {
            return res.status(404).json({ error: "User not found." });
        }

        currentUser.following = currentUser.following.filter(
            (id) => id.toString() !== targetUserId
        );
        targetUser.followers = targetUser.followers.filter(
            (id) => id.toString() !== currentUserId
        );

        await currentUser.save();
        await targetUser.save();

        res.status(200).json({ message: 'Unfollowed successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET a public user profile by username and their recipes
router.get('/profile/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Pull recipes where userEmail matches the email
        const Recipe = require('../models/Recipe');
        const recipes = await Recipe.find({ userEmail: user.email });

        res.json({ user, recipes });
    } catch (err) {
        console.error('Profile fetch error:', err);
        res.status(500).json({ error: 'Server error fetching user profile' });
    }
});

module.exports = router;
