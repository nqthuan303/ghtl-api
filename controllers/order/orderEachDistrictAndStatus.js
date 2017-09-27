'use strict';

const model = require('./../../models/order.model');

const orderStatusModel = require('./../../models/orderStatus.model');

const API = require('./../../APILib');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

// get list order sender district with status 'storage'
module.exports = async (req, res) => {
    var objQuery = req.query;

    const orderStatus = await orderStatusModel.findOne({value: objQuery.status});
    const statusId = orderStatus._id;

    var district = {}
    if(objQuery.districtId && objQuery.districtId !== 'all') {
        district = ObjectId(objQuery.districtId)
    }

    model.
    find({orderstatus: statusId, 'reciever.district': district}).
    populate('reciever.district', '_id type name').
    where('this.orders.length > 0').
    exec(function(err, data) {
        if (err) {
            return API.fail(res, err);
        }
        API.success(res, data);
    });

};