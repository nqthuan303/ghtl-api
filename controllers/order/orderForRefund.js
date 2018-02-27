'use strict';

var model = require('./../../models/order.model');
const orderStatusModel = require('./../../models/orderStatus.model');
const districtModel = require('./../../models/district.model');
const status = require('./../../constants/status')
var API = require('./../../APILib');

module.exports = async (req, res) => {

    const orderStatus = await orderStatusModel.find({
        value: {
            $in: [ status.order.REFUND_STORAGE, status.order.CANCEL_STORAGE]
        }
    });
    let arrStatusId = [];
    for(let i=0; i< orderStatus.length ; i++){
        arrStatusId.push(orderStatus[i]._id)
    }
    const statusId = orderStatus._id;
    let orders = await model
        .find({orderstatus: {$in: arrStatusId}})
        .populate("sender.district", "_id type name");
    if(orders){
        API.success(res, orders);
    }
};