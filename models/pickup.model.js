var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var counter = require('./counter.model');

var objSchema = new Schema({
    id: String,
    user: {type: ObjectId, ref: 'user'}, //shipper
    client: {type: ObjectId, ref: 'client'},
    orders: [{type: ObjectId, ref: 'order'}],
    createdBy: {type: ObjectId, ref: 'user', required: true },
    updatedBy: [{type: ObjectId, ref: 'user'}]
}, { timestamps: true });

objSchema.pre('save', function(next) {
    var doc = this;
    counter.findByIdAndUpdate(
        {_id: 'pickupId'}, 
        {$inc: { seq: 1} }, function(error, counter)   {
        if(error) return next(error);
        doc.id = counter.seq;
        next();
    });
});

module.exports = mongoose.model('pickup', objSchema, 'pickup');