const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
  messages: Array,
  admin: Boolean,
  newMessages: Boolean,
})

module.exports = User = mongoose.model('User', UserSchema);