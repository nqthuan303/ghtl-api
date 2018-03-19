var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
const { getOrderStatus, order: orderStatus, orderPayBy, paymentStatus } = require('../constants/status');
var counter = require('./counter.model');

var objSchema = new Schema({
    id: String,
    client: {type: ObjectId, required: true, ref: 'client' },
    sender: {
        phone: {type: String, required: true},
        province: {type: ObjectId, ref: 'province', default: '587124bcbe644a04d4b14e8b', required: true },
        district: {type: ObjectId, required: true, ref: 'district' },
        address: {type: String, required: true},
        lat: String,
        lng: String,
        paymentMethod: {
            type: String,
            required: true,
            enum: ['cod', 'ung'],
        },
    },
    receiver: {
        name: {type: String, required: true},
        phone: {type: String, required: true},
        province: {type: ObjectId, ref: 'province', default: '587124bcbe644a04d4b14e8b', required: true },
        district: {type: ObjectId, required: true, ref: 'district' },
        ward: {type: ObjectId, required: true, ref: 'ward' },
        address: {type: String, required: true},
        lat: String,
        lng: String,
    },
    goods: {
        value: {type: Number},
        length: Number,
        width: Number,
        height: Number
    },
    require: String,
    note: String,
    goodMoney: {type: Number, required: true},
    shipFee: {type: Number, required: true},
    payBy: {
        type: String,
        required: true,
        enum: [orderPayBy.SENDER.value, orderPayBy.RECEIVER.value],
        default: orderPayBy.SENDER.value
    },
    orderstatus: {
        type: String,
        required: true,
        enum: getOrderStatus(),
        default: orderStatus.TEMP.value
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: [paymentStatus.PENDING.value, paymentStatus.UNPAID.value, paymentStatus.PAID.value],
        default: paymentStatus.PENDING.value
    },
    createdBy: {type: ObjectId, ref: 'user', required: true },
    updatedBy: [{type: ObjectId, ref: 'user'}]
}, { timestamps: true });

objSchema.pre('save', function(next) {
    var doc = this;
    counter.findByIdAndUpdate({_id: 'orderId'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error) return next(error);
        doc.id = counter.seq;
        next();
    });
});

module.exports = mongoose.model('order', objSchema, 'order');