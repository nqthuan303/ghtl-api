'use strict';

var model = require('./../../models/order.model');
const orderStatusModel = require('./../../models/orderStatus.model');
const districtModel = require('./../../models/district.model');
var API = require('./../../APILib');
// count order in sender district with status 'storage'
module.exports = async (req, res) => {

    var objQuery = req.query;

    const orderStatus = await orderStatusModel.findOne({value: objQuery.status});
    const statusId = orderStatus._id;
    let orders = await model.find({orderstatus: statusId}).populate("receiver.district", "_id type name");
    if(orders){
        API.success(res, orders);
    }
};