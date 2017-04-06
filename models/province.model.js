var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var provinceSchema = new Schema({
    name: String,
    type: String
});

module.exports = mongoose.model('province', provinceSchema, 'province');