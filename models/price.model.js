const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const objSchema = new Schema({
    area: String,
    client: {type: ObjectId, required: true, ref: 'client' },
    price: String,
    districts: [{type: ObjectId, ref: 'district'}],
    createdBy: {type: ObjectId, ref: 'user', required: true },
    updatedBy: [{type: ObjectId, ref: 'user'}]
}, { timestamps: true });

module.exports = mongoose.model('price', objSchema, 'price');