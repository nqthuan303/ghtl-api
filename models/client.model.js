var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var bcrypt = require('bcryptjs'), SALT_WORK_FACTOR = 10;
var counter = require('./counter.model');

var objSchema = new Schema({
    id: String,
    name: { type: String, required: true },
    payments: [{type: ObjectId, ref: 'payment'}],
    email: { type: String, required: true },
    password: { type: String, select: false, required: true },
    username: { type: String, required: true, index: { unique: true } },
    orders: [{type: ObjectId, ref: 'order'}],
    contactName: { type: String, required: true },
    province: {type: ObjectId, ref: 'province', required: true, default: '587124bcbe644a04d4b14e8b' },
    district: {type: ObjectId, ref: 'district', required: true },
    ward: {type: ObjectId, ref: 'ward' },
    address: { type: String, required: true },
    lat: { type: String},
    lng: { type: String},
    phone: { type: String, required: true },
    phone_2: String,
    website: String,
    updatedBank: { type: Boolean, required: true, default: false },
    bankNumber: String,
    bankAccount: String,
    bankBranch: String,
    bankName: String,
    descriptionOfGoods: String,
    createdBy: {type: ObjectId, ref: 'user', required: true },
    updatedBy: {type: ObjectId, ref: 'user' },
    status: {
        type: String, 
        required: true, 
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, { timestamps: true });

objSchema.pre('save', function(next) {
    var doc = this;
    if (!doc.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(doc.password, salt, function(err, hash) {
                if (err) return next(err);
                doc.password = hash;
                next();
            }
        );
    });
    counter.findByIdAndUpdate({_id: 'clientId'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error) return next(error);
        doc.id = counter.seq;
        next();
    });
});
objSchema.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};
module.exports = mongoose.model('client', objSchema, 'client');