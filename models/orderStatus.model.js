var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderStatusSchema = new Schema({
    value: String,
    name: String
});
module.exports = mongoose.model('orderstatus', orderStatusSchema, 'orderstatus');