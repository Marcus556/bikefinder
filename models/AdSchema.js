const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdSchema = new Schema({
  owner: String,
  title: String,
  url: String,
  thumbnail: String,
  img: String,
  price: Number,
  desc: String,
  createdOn: { type: Date, default: Date.now }
})

module.exports = Ad = mongoose.model('Ad', AdSchema);