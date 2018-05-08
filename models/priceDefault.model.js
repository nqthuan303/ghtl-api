const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const objSchema = new Schema({
    area: String,
    price: String,
    districts: [{type: ObjectId, ref: 'district'}]
}, { timestamps: true });

module.exports = mongoose.model('priceDefault', objSchema, 'priceDefault');