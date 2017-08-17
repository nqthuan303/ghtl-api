var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var wardSchema = new Schema({
    name: String,
    type: String,
    location: String,
    district: String
});

module.exports = mongoose.model('ward', wardSchema, 'ward');