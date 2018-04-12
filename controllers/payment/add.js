'use strict';

const model = require('./../../models/payment.model');
const orderModel = require('./../../models/order.model');
const API = require('./../../APILib');
const utils = require('./../../utils');
const {paymentStatus} = require('../../constants/status');

module.exports = async (req, res) => {
  const data = req.body;
  const authInfo = utils.getAuthInfo(req.headers.authorization);
  data.createdBy = authInfo._id;
  const objData = new model(data);

  try {
    const saveOrder = await objData.save({returnNewDocument : true});

    const updateOrder = await orderModel.update(
      { _id : { $in : data.orders }}, 
      { paymentStatus: paymentStatus.UNPAID.value}, 
      {"multi": true}
    )

    API.success(res, saveOrder);
  } catch (err) {
    return API.fail(res, err.message);
  }

};