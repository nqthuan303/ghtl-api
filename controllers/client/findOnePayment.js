'use strict';

var model = require('./../../models/client.model');
var paymentModel = require('./../../models/payment.model');
const {order: orderStatus, paymentStatus, payment: paymentTable} = require('../../constants/status');
var API = require('./../../APILib');

const objSearch = {
  orderstatus: {$in: [
      orderStatus.DELIVERED.value,
      orderStatus.RETURNFEESTORAGE.value,
      orderStatus.RETURNFEEPREPARE.value,
      orderStatus.RETURNINGFEE.value,
      orderStatus.RETURNEDFEE.value,
      orderStatus.RETURNSTORAGE.value,
      orderStatus.RETURNPREPARE.value,
      orderStatus.RETURNING.value,
      orderStatus.RETURNED.value,
  ]},
  paymentStatus: {$in: [
      paymentStatus.PENDING.value,
      paymentStatus.UNPAID.value,
  ]}
};
module.exports = async (req, res) => {
  var objParams = req.params;
  try {
    const result = await model
      .findById(objParams.id)
      .populate({
          path: 'orders',
          match: objSearch
      }).lean();
    const payment = await paymentModel.findOne({
      client: objParams.id,
      status : paymentTable.DOING
    }).lean();
    result.payment = payment ? {id: payment.id, _id: payment._id} : ''
    API.success(res, result);
  } catch (error) {
    API.fail(res, error);
  }
};