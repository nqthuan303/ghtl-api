var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var objSchema = new Schema({
    name: { type: String, required: true },
    createdBy: {type: ObjectId, ref: 'user', required: true },
    updatedBy: {type: ObjectId, ref: 'user' } 
}, { timestamps: true });

module.exports = mongoose.model('role', objSchema, 'role');