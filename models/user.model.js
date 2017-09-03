var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs'), SALT_WORK_FACTOR = 10;
var ObjectId = Schema.Types.ObjectId;

var objSchema = new Schema({
    name: {type: String, required: true},
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, select: false, required: true },
    province: {type: ObjectId, ref: 'province', default: '587124bcbe644a04d4b14e8b' },
    district: {type: ObjectId, required: true, ref: 'district' },
    ward: {type: ObjectId, ref: 'ward' },
    address: {type: String, required: true},
    phone: {type: String, required: true},
    status: {type: Number, default: 1, required: true },
    role: {type: ObjectId, ref: 'role', required: true},
    createdBy: {type: ObjectId, ref: 'user', required: true},
    updatedBy: {type: ObjectId, ref: 'user' }
}, { timestamps: true });

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