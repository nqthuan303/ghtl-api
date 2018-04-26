var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs'), SALT_WORK_FACTOR = 10;
var ObjectId = Schema.Types.ObjectId;

var counter = require('./counter.model');

var objSchema = new Schema({
    id: String,
    name: {type: String, required: true},
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, select: false, required: true },
    province: {type: ObjectId, ref: 'province', default: '587124bcbe644a04d4b14e8b' },
    district: {type: ObjectId, ref: 'district' },
    ward: {type: ObjectId, ref: 'ward' },
    address: {type: String, required: true},
    email: String,
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

    counter.findByIdAndUpdate({_id: 'userId'}, {$inc: { seq: 1} }, function(error, counter)   {
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

module.exports = mongoose.model('user', objSchema, 'user');