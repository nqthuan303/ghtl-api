var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var clientSchema = new Schema({
    name: { type: String, required: true },
    contact_name: { type: String, required: true },
    province: {type: ObjectId, ref: 'province', required: true, default: '587124bcbe644a04d4b14e8b' },
    district: {type: ObjectId, ref: 'district' },
    ward: {type: ObjectId, ref: 'ward' },
    address: { type: String, required: true },
    phone_number: { type: String, required: true },
    phone_number_2: String,
    link: String,
    bankNumber: String,
    bankAccount: String,
    bankBranch: String,
    bankName: String,
    createdBy: {type: ObjectId, ref: 'user', required: true },
    updatedBy: {type: ObjectId, ref: 'user' },
    orderType: String,
    status: {type: Number, required: true, default: 1 }
    
}, { timestamps: true });

module.exports = mongoose.model('client', clientSchema, 'client');