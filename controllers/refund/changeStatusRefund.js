'use strict';

var model = require('./../../models/delivery.model');
const orderModel = require('./../../models/order.model');
const orderStatusModel = require('./../../models/orderStatus.model');
const status = require('../../constants/status')
var API = require('./../../APILib');

module.exports = async (req, res) => {
  var id = req.params.id;

  try {
    const startTime = new Date();
    const result = await model.findOneAndUpdate({_id: id}, {status: 'delivery', startTime}, {returnNewDocument : true});
    
    const orderStatus = await orderStatusModel.findOne({value: status.order.DELIVERY});
    const orderStatusId = orderStatus._id;
    const updateOrder = await orderModel.update(
      { _id : { $in : result.orders }}, 
      { orderstatus: orderStatusId}, 
      {"multi": true}
    )
    API.success(res, "Chuyển thành đang giao hàng thành công!!!");
  } catch (error) {
    API.fail(res, error.message);
  }
  
};