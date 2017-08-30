var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var objSchema = new Schema({
    value: String,
    name: String
});
module.exports = mongoose.model('orderstatus', objSchema, 'orderstatus');