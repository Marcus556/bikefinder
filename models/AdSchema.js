const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdSchema = new Schema({
  title: String,
  url: String,
  thumbnail: String,
  img: String,
  price: String,
  info: String,
})

module.exports = Ad = mongoose.model('Ad', AdSchema);