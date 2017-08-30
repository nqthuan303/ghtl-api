var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var objSchema = new Schema({
    name: String,
    type: String
});

module.exports = mongoose.model('province', objSchema, 'province');