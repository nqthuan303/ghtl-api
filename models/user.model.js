var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs'), SALT_WORK_FACTOR = 10;

var objSchema = new Schema({
    name: {type: String, required: true},
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, select: false, required: true },
    province_id: {type: Schema.Types.ObjectId, ref: 'province', default: '587124bcbe644a04d4b14e8b' },
    district_id: {type: Schema.Types.ObjectId, required: true, ref: 'district' },
    ward_id: {type: Schema.Types.ObjectId, ref: 'ward' },
    address: {type: String, required: true},
    phone_number: {type: String, required: true},
    status: {type: Number, default: 1, required: true },
    createdAt: {type: Date, default: Date.now},
    createdBy: {type: Schema.Types.ObjectId, ref: 'user', required: true},
    modifiedAt: {type: Date, default: Date.now},
    modifiedBy: {type: Schema.Types.ObjectId, ref: 'user' }
    
});

objSchema.pre('save', function(next) {
    let user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            }
        );
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

module.exports = mongoose.model('user', objSchema, 'user');