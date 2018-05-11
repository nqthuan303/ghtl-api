var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var CounterModel = require('./counter.model');
const status = require('../constants/status');
const utils = require('../utils');

const dataSchema = new Schema({
    client: {type: ObjectId, ref: 'client', required: true},
    orders: [{type: ObjectId, ref: 'order', required: true}]
}, {_id: false});

var objSchema = new Schema({
    id: String,
    shipper: {type: ObjectId, ref: 'user', required: true}, //shipper
    data: [dataSchema],
    status: {
        type: String, 
        required: true, 
        enum: [status.pickup.PENDING, status.pickup.DOING, status.pickup.DONE],
        default: status.pickup.INPROCESS
    },
    createdBy: {type: ObjectId, ref: 'user' },
    updatedBy: [{type: ObjectId, ref: 'user'}]
}, { timestamps: true });

objSchema.pre('save', async function(next, req) {
    var doc = this;
    const authInfo = utils.getAuthInfo(req.headers.authorization);
    try {
        const counter = await CounterModel.findByIdAndUpdate({_id: 'pickupId'}, {$inc: { seq: 1} });
        doc.id = counter.seq;
        doc.createdBy = authInfo._id;
        next();
    } catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model('pickup', objSchema, 'pickup');