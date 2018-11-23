//所有會員
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('user', new Schema({
    userid: String,
    name: String,
    image: String,
    pushenable: Boolean,
    location: [String]
}), 'user');