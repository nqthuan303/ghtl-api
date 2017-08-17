var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var districtSchema = new Schema({
    name: String,
    type: String,
    location: String,
    province: String,
});

module.exports = mongoose.model('district', districtSchema, 'district');