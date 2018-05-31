  'use strict';

  const model = require('./../../models/order.model');
  const PaymentModel = require('./../../models/payment.model');
  const API = require('./../../APILib');
  const { payment: paymentStatus } = require('../../constants/status');

  module.exports = async (req, res) => {
    const id = req.params.id;
    try {
      const populateOpt = {
        path: 'client',
        select: 'name phone address district ward',
        populate: [
          {
            path: 'district',
            select: 'name type'
          },
          {
            path: 'ward',
            select: 'name type'
          }
        ]
      };
      const order = await model.findById(id).populate(populateOpt);
      const payment = await PaymentModel.findOne({orders: id}).select('startTime id endTime status');
      const result = {order, payment};
      API.success(res, result); 
    } catch (error) {
      API.fail(res, error.message)
    }
  };