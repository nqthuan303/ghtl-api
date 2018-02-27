var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var counter = require('./counter.model');
const status = require('../constants/status');
const utils = require('../utils');

const dataSchema = new Schema({
    clientId: {type: ObjectId, ref: 'client', required: true},
    orders: [{type: ObjectId, ref: 'order', required: true}]
}, {_id: false});

var objSchema = new Schema({
    id: String,
    user: {type: ObjectId, ref: 'user', required: true}, //shipper
    data: [dataSchema],
    status: {
        type: String, 
        required: true, 
        enum: [status.pickup.PENDING, status.pickup.DOING, status.pickup.DONE],
        default: status.pickup.PENDING
    },
    createdBy: {type: ObjectId, ref: 'user' },
    updatedBy: [{type: ObjectId, ref: 'user'}]
}, { timestamps: true });

objSchema.pre('save', function(next, req) {
    var doc = this;
    const authInfo = utils.getAuthInfo(req.headers.authorization);

    counter.findByIdAndUpdate(
        {_id: 'pickupId'}, 
        {$inc: { seq: 1} }, function(error, counter)   {
            if(error) return next(error);
            doc.id = counter.seq;
            doc.createdBy = authInfo._id;
            next();
        });
});

module.exports = mongoose.model('pickup', objSchema, 'pickup');