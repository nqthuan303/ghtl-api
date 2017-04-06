var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var objSchema = new Schema({
    order_id: {type: Schema.Types.ObjectId, required: true, ref: 'order' },
    orderstatus_id: {type: Schema.Types.ObjectId, required: true, ref: 'orderstatus' },
    datetime_added: {type: Date, default: Date.now}
});

module.exports = mongoose.model('orderlog', objSchema, 'orderlog');