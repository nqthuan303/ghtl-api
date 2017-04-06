var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clientSchema = new Schema({
    name: String,
    contact_name: String,
    province_id: {type: Schema.Types.ObjectId, ref: 'province', default: '587124bcbe644a04d4b14e8b' },
    district_id: {type: Schema.Types.ObjectId, ref: 'district' },
    ward_id: {type: Schema.Types.ObjectId, ref: 'ward' },
    address: String,
    phone_number: String,
    phone_number_2: String,
    link: String,
    datetime_added: {type: Date, default: Date.now},
    status: {type: Number, default: 1 },
    bankNumber: String,
    bankAccount: String,
    bankBranch: String,
    bankName: String,
});

module.exports = mongoose.model('client', clientSchema, 'client');