var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var objSchema = new Schema({
    order: {type: ObjectId, required: true, ref: 'order' },
    orderstatus: {type: ObjectId, required: true, ref: 'orderstatus' },
    createdBy: {type: ObjectId, ref: 'user', required: true }
}, { timestamps: true });

module.exports = mongoose.model('orderlog', objSchema, 'orderlog');