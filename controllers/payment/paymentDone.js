'use strict';

var model = require('./../../models/payment.model'),
    orderModel = require('./../../models/order.model'),
    API = require('./../../APILib');

const {payment, paymentStatus} = require('../../constants/status');

module.exports = async (req, res) => {
  var id = req.params.id;
  try {
    const endTime = new Date();
    const result = await model.findOneAndUpdate({_id: id}, {
      status: payment.DONE,
      endTime,
    }, {returnNewDocument : true}).lean();
    const updateOrder = await orderModel.update(
      { _id : { $in : result.orders }}, 
      { paymentStatus: paymentStatus.PAID.value}, 
      {"multi": true}
    )
    API.success(res, "Bảng kê đã được thanh toán thành công!!!");
  } catch (error) {
    API.fail(res, error.message);
  }
  
};