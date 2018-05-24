'use strict';

var model = require('./../../models/order.model');
var paymentModel = require('./../../models/payment.model');
var API = require('./../../APILib');
const {paymentStatus, payment: paymentTable} = require('../../constants/status');

module.exports = async (req, res) => {
    var objQuery = req.query;
    try {
      let order = await model.findById(objQuery.id).populate('client').populate('receiver.district').populate('receiver.ward').lean();
      if(order.paymentStatus === paymentStatus.PAID.value){
        const payment = await paymentModel.findOne({ 
          orders: order._id,
          status: paymentTable.DONE}).select('_id id endTime status');
        order.payment = payment;
      }
      API.success(res, order); 
    } catch (error) {
      API.fail(res, error.message)
    }
};