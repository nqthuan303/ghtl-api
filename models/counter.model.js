var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var objSchema = new Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});

module.exports = mongoose.model('counter', objSchema, 'counter');