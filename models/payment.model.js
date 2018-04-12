var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var counter = require('./counter.model');
const status = require('../constants/status');

var objSchema = new Schema({
    id: String,
    client: {type: ObjectId, ref: 'client'}, //shipper
    orders: [{type: ObjectId, ref: 'order'}],
    status: {
        type: String, 
        required: true, 
        enum: [status.payment.CANCEL, status.payment.DOING, status.payment.DONE],
        default: status.refund.DOING
    },
    createdBy: {type: ObjectId, ref: 'user', required: true },
    updatedBy: [{type: ObjectId, ref: 'user'}],
    startTime: Date, // thời gian bắt đầu tạo bảng
    endTime: Date, // thời gian đã thanh toán tiền cho shop
}, { timestamps: true });

objSchema.pre('save', function(next) {
    var doc = this;
    counter.findByIdAndUpdate(
        {_id: 'paymentId'},
        {$inc: { seq: 1} }, function(error, counter)   {
        if(error) return next(error);
        doc.id = counter.seq;
        next();
    });
});

module.exports = mongoose.model('payment', objSchema, 'payment');