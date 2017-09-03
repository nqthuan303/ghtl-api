var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var counter = require('./counter.model');

var objSchema = new Schema({
    id: String,
    name: { type: String, required: true },
    orders: [{type: ObjectId, ref: 'order'}],
    contact_name: { type: String, required: true },
    province: {type: ObjectId, ref: 'province', required: true, default: '587124bcbe644a04d4b14e8b' },
    district: {type: ObjectId, ref: 'district' },
    ward: {type: ObjectId, ref: 'ward' },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    phone_2: String,
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

objSchema.pre('save', function(next) {
    var doc = this;
    counter.findByIdAndUpdate({_id: 'clientId'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error) return next(error);
        doc.id = counter.seq;
        next();
    });
});

module.exports = mongoose.model('client', objSchema, 'client');