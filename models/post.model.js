var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var objSchema = new Schema({
    title: {type: String, required: true},
    user: {type: ObjectId, ref: 'user', required: true},
    updatedBy: {type: ObjectId, ref: 'user' }
}, {timestamps: true});

module.exports = mongoose.model('post', objSchema, 'post');