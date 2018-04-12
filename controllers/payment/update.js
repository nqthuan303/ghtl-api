'use strict';

var model = require('./../../models/delivery.model');
const orderModel = require('./../../models/order.model');
var API = require('./../../APILib');
const {order: orderStatus} = require('../../constants/status');

module.exports = async (req, res) => {
  var id = req.params.id;
  var data = req.body;
  // cập nhật chuyến đi giao với trạng thái đơn hàng là chuẩn bị đi giao
  try {
    const result = await model.findOneAndUpdate({_id: id}, data, {returnNewDocument : true});
    const updateOrder = await orderModel.update(
      { _id : { $in : data.orders }}, 
      { orderstatus: orderStatus.DELIVERYPREPARE.value}, 
      {"multi": true}
    )
    API.success(res, data);
  } catch (error) {
    API.fail(res, error);
  }
  
};