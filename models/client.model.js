var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clientSchema = new Schema({
    name: { type: String, required: true },
    contact_name: { type: String, required: true },
    province_id: {type: Schema.Types.ObjectId, ref: 'province', required: true, default: '587124bcbe644a04d4b14e8b' },
    district_id: {type: Schema.Types.ObjectId, ref: 'district' },
    ward_id: {type: Schema.Types.ObjectId, ref: 'ward' },
    address: { type: String, required: true },
    phone_number: { type: String, required: true },
    phone_number_2: String,
    link: String,
    bankNumber: String,
    bankAccount: String,
    bankBranch: String,
    bankName: String,
    createdAt: {type: Date, default: Date.now},
    createdBy: {type: Schema.Types.ObjectId, ref: 'user', required: true },
    modifiedAt: {type: Date, default: Date.now},
    modifiedBy: {type: Schema.Types.ObjectId, ref: 'user' },
    status: {type: Number, required: true, default: 1 }
    
});

module.exports = mongoose.model('client', clientSchema, 'client');