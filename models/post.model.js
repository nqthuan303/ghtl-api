var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var objSchema = new Schema({
    title: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'user', required: true},
    updatedBy: {type: Schema.Types.ObjectId, ref: 'user' }
}, {timestamps: true});

module.exports = mongoose.model('post', objSchema, 'post');