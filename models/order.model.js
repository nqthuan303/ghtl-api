var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var orderSchema = new Schema({
    client_id: {type: Schema.Types.ObjectId, ref: 'client' },
    user_id: {type: Schema.Types.ObjectId, ref: 'user' },
    shipper_id: { type: String, default: ''},
    reciever_name: String,
    reciever_phone: String,
    province_id: {type: Schema.Types.ObjectId, ref: 'province', default: '587124bcbe644a04d4b14e8b' },
    district_id: {type: Schema.Types.ObjectId, ref: 'district' },
    ward_id: {type: Schema.Types.ObjectId, ref: 'ward' },
    address: String,
    bonus_fee: { type: Number, default: 0},
    ship_fee: Number,
    note: String,
    orderstatus_id: {type: Schema.Types.ObjectId, default: '5884a56f7b66847851a426e6', ref: 'orderstatus' },
    datetime_added: {type: Date, default: Date.now},
    datetime_done: { type: Date},
    datetime_modified: { type: Date}
});

module.exports = mongoose.model('order', orderSchema, 'order');