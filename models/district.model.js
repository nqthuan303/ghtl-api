var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var objSchema = new Schema({
    name: String,
    type: String,
    location: String,
    province: String,
});

module.exports = mongoose.model('district', objSchema, 'district');