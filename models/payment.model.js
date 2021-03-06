var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var counter = require('./counter.model');
const {payment: paymentStatus, paymentMethods} = require('../constants/status');

var objSchema = new Schema({
    id: String,
    client: {type: ObjectId, ref: 'client'}, //shipper
    orders: [{type: ObjectId, ref: 'order'}],
    money: Number,
    status: {
        type: String, 
        required: true, 
        enum: [paymentStatus.CANCEL, paymentStatus.DOING, paymentStatus.DONE],
        default: paymentStatus.DOING
    },
    createdBy: {type: ObjectId, ref: 'user', required: true },
    updatedBy: [{type: ObjectId, ref: 'user'}],
    startTime: Date, // thời gian bắt đầu tạo bảng
    endTime: Date, // thời gian đã thanh toán tiền cho shop
    method: {
        type: String, 
        required: true, 
        enum: [paymentMethods.CASH.value, paymentMethods.TRANSFER.value],
        default: paymentMethods.CASH.value
    },
    bank: {
        type: String,
        required: function () {
            let result = true;
            if (this.method === paymentMethods.CASH.value) {
                result = false;
            }
            return result;
        },
    },
    bill: {
        type: String,
        required: function () {
            let result = true;
            if (this.method === paymentMethods.CASH.value) {
                result = false;
            }
            return result;
        },
    },
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