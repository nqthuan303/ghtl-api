'use strict';

var model = require('./../../models/delivery.model');
const orderModel = require('./../../models/order.model');
var API = require('./../../APILib');
const {order: orderStatus} = require('../../constants/status');

module.exports = async (req, res) => {
  var id = req.params.id;

  try {
    const startTime = new Date();
    const result = await model.findOneAndUpdate({_id: id}, {status: orderStatus.DELIVERY.value, startTime}, {returnNewDocument : true});
    
    const updateOrder = await orderModel.update(
      { _id : { $in : result.orders }}, 
      { orderstatus: orderStatus.DELIVERY.value}, 
      {"multi": true}
    )
    API.success(res, "Chuyển thành đang giao hàng thành công!!!");
  } catch (error) {
    API.fail(res, error.message);
  }
  
};