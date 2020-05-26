const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
  admin: Boolean,
})

module.exports = User = mongoose.model('User', UserSchema);