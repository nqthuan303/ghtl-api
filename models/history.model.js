var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
const { getOrderStatus, order: orderStatus } = require('../constants/status');
var counter = require('./counter.model');

var objSchema = new Schema({
    id: String,
    type: {
        type: String,
        required: true,
        enum: ['delivery', 'pickup'],
    },
    typeId: {type: ObjectId, refPath: 'typeId', required: true},
    orderId: {type: ObjectId, ref: 'order', required: true},
    orderStatus: {
        type: String,
        required: true,
        enum: getOrderStatus(),
    },
    note: String
}, { timestamps: true });

objSchema.pre('save', function(next) {
    var doc = this;
    counter.findByIdAndUpdate({_id: 'historyId'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error) return next(error);
        doc.id = counter.seq;
        next();
    });
});

module.exports = mongoose.model('history', objSchema, 'history');