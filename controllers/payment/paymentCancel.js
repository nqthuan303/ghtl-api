'use strict';

var model = require('./../../models/payment.model'),
    orderModel = require('./../../models/order.model'),
    API = require('./../../APILib');

const {payment, paymentStatus} = require('../../constants/status');

module.exports = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await model.findOneAndUpdate({_id: id}, { status: payment.CANCEL}, {returnNewDocument : true}).lean();
    const updateOrder = await orderModel.update(
      { _id : { $in : result.orders }}, 
      { paymentStatus: paymentStatus.PENDING.value}, 
      {"multi": true}
    )
    API.success(res, "Hủy bảng kê thành công!!!");
  } catch (error) {
    API.fail(res, error.message);
  }
  
};