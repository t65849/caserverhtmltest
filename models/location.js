//在beacon的會員
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('location', new Schema({
    name: String,
    locationid: String,
    user: [String],
    latitude: String,
    longitude: String
}), 'location');