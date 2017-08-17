var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var objSchema = new Schema({
    order: {type: Schema.Types.ObjectId, required: true, ref: 'order' },
    orderstatus: {type: Schema.Types.ObjectId, required: true, ref: 'orderstatus' },
    user: {type: Schema.Types.ObjectId, ref: 'user', required: true }
}, { timestamps: true });

module.exports = mongoose.model('orderlog', objSchema, 'orderlog');