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
    orderstatus: {type: ObjectId, default: '599992d32fc27aec771a8acb', ref: 'orderstatus' },
    createdBy: {type: ObjectId, ref: 'user', required: true },
    updatedBy: [{type: ObjectId, ref: 'user'}]
}, { timestamps: true });

module.exports = mongoose.model('order', orderSchema, 'order');