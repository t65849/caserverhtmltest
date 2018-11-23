//活動內容
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('shuangjiou', new Schema({
    name: String,
    description: String,
    starttime: Date,
    endtime: Date,
    type: String,
    location: String,
    latitude: String,
    longitude: String,
    host: String,
    number: Number,
    shuangjiouid: String,
    participant: [String],
    fare : String
}), 'shuangjiou');