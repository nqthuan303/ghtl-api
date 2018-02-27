var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var counter = require('./counter.model');

var objSchema = new Schema({
    id: String,
    user: {type: ObjectId, ref: 'user'}, //shipper
    orders: [{type: ObjectId, ref: 'order'}],
    status: {
        type: String, 
        required: true, 
        enum: ['unCompleted', 'completed', 'refund'],
        default: 'unCompleted'
    },
    createdBy: {type: ObjectId, ref: 'user', required: true },
    updatedBy: [{type: ObjectId, ref: 'user'}],
    startTime: Date, // thời gian bắt đầu trả hàng
    endTime: Date, // thời gian kết thúc chuyến đi trả hàng
}, { timestamps: true });

objSchema.pre('save', function(next) {
    var doc = this;
    counter.findByIdAndUpdate(
        {_id: 'refundId'},
        {$inc: { seq: 1} }, function(error, counter)   {
        if(error) return next(error);
        doc.id = counter.seq;
        next();
    });
});

module.exports = mongoose.model('refund', objSchema, 'refund');