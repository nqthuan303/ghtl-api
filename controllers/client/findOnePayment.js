'use strict';

var model = require('./../../models/client.model');
const {
  order: orderStatus, 
  paymentStatus, 
  payment: paymentTable
} = require('../../constants/status');
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
        path: 'payments',
        match: {status: paymentTable.DOING},
        select: '_id id'
      })
      .populate({
          path: 'orders',
          match: objSearch
      }).lean();
    API.success(res, result);
  } catch (error) {
    API.fail(res, error.message);
  }
};