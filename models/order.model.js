var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var orderSchema = new Schema({
    client: {type: ObjectId, required: true, ref: 'client' },
    sender: {
        phoneNumbers: {type: String, required: true},
        province: {type: ObjectId, ref: 'province', default: '587124bcbe644a04d4b14e8b', required: true },
        district: {type: ObjectId, required: true, ref: 'district' },
        address: {type: String, required: true},
        lat: String,
        lng: String,
        orderType: {type: String, required: true},
    },
    reciever: {
        name: {type: String, required: true},
        phoneNumbers: [String],
        province: {type: ObjectId, ref: 'province', default: '587124bcbe644a04d4b14e8b', required: true },
        district: {type: ObjectId, required: true, ref: 'district' },
        address: {type: String, required: true},
        lat: String,
        lng: String,
    },
    inProcess: {type: Boolean, required: true, default: true},
    orderstatus: {type: ObjectId, default: '5884a56f7b66847851a426e6', ref: 'orderstatus' },
    user: {type: ObjectId, ref: 'user', required: true },
    modifiedBy: [{type: ObjectId, ref: 'user'}]
}, { timestamps: true });

module.exports = mongoose.model('order', orderSchema, 'order');