var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var objSchema = new Schema({
    order_id: {type: Schema.Types.ObjectId, required: true, ref: 'order' },
    orderstatus_id: {type: Schema.Types.ObjectId, required: true, ref: 'orderstatus' },
    createdAt: {type: Date, default: Date.now},
    createdBy: {type: Schema.Types.ObjectId, ref: 'user', required: true }
});

module.exports = mongoose.model('orderlog', objSchema, 'orderlog');