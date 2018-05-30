'use strict';

var model = require('./../../models/client.model');
const {order: orderStatus, paymentStatus, payment: paymentTable} = require('../../constants/status');
var API = require('./../../APILib');

const populateOpt = [
  {
      path: 'receiver.district',
      select: 'type name'
  },
  {
      path: 'receiver.ward',
      select: 'type name'
  }
]

module.exports = async (req, res) => {
  var objQuery = req.query;
  try {
    const result = await model.findOne({ username: objQuery.username}).populate({
        path: 'orders',
        match: {
          paymentStatus: {$in: [
            paymentStatus.PENDING.value,
            paymentStatus.UNPAID.value,
          ]}
        },
        populate: populateOpt,
      });
    API.success(res, result);
  } catch (error) {
    API.fail(res, error);
  }
};