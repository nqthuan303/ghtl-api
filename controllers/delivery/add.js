'use strict';

const model = require('./../../models/delivery.model');
const orderModel = require('./../../models/order.model');
const API = require('./../../APILib');
const utils = require('./../../utils');
const {order: orderStatus} = require('../../constants/status');

module.exports = async (req, res) => {
  const data = req.body;
  const authInfo = utils.getAuthInfo(req.headers.authorization);
  data.createdBy = authInfo._id;
  const objData = new model(data);

  try {
    const saveOrder = await objData.save();

    const updateOrder = await orderModel.update(
      { _id : { $in : data.orders }}, 
      { orderstatus: orderStatus.DELIVERYPREPARE.value}, 
      {"multi": true}
    )

    API.success(res, {
        message: 'Success!'
    });
  } catch (err) {
    return API.fail(res, err.message);
  }

};