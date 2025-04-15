const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },  // Firebase UID
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true }, // added manually
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('User', UserSchema);
