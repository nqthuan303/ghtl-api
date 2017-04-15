var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var orderSchema = new Schema({
    client_id: {type: Schema.Types.ObjectId, required: true, ref: 'client' },
    user_id: {type: Schema.Types.ObjectId, ref: 'user' },
    shipper_id: { type: String, default: ''},
    reciever_name: { type: String, required: true },
    reciever_phone: String,
    province_id: {type: Schema.Types.ObjectId, ref: 'province', default: '587124bcbe644a04d4b14e8b' },
    district_id: {type: Schema.Types.ObjectId, required: true, ref: 'district' },
    ward_id: {type: Schema.Types.ObjectId, ref: 'ward' },
    address: { type: String, required: true },
    bonus_fee: { type: Number, default: 0},
    ship_fee: { type: Number, required: true },
    note: String,
    orderstatus_id: {type: Schema.Types.ObjectId, default: '5884a56f7b66847851a426e6', ref: 'orderstatus' },
    createdAt: {type: Date, default: Date.now},
    createdBy: {type: Schema.Types.ObjectId, ref: 'user', required: true },
    modifiedAt: {type: Date, default: Date.now},
    modifiedBy: {type: Schema.Types.ObjectId, ref: 'user' }
});

module.exports = mongoose.model('order', orderSchema, 'order');