var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

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
    bonusFee: String,
    shipFee: {type: Number, required: true},
    orderstatus: {type: ObjectId, default: '599992d32fc27aec771a8acb', ref: 'orderstatus' },
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