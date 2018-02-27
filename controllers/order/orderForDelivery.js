'use strict';

var model = require('./../../models/order.model');
const orderStatusModel = require('./../../models/orderStatus.model');
const districtModel = require('./../../models/district.model');
const status = require('./../../constants/status')
var API = require('./../../APILib');

module.exports = async (req, res) => {
    const orderStatus = await orderStatusModel.findOne({value: status.order.STORAGE});
    const statusId = orderStatus._id;
    let orders = await model.find({orderstatus: statusId}).populate("receiver.district", "_id type name");
    if(orders){
        API.success(res, orders);
    }
};