'use strict';

const model = require('./../../models/pickup.model');
const orderModel = require('./../../models/order.model');
const orderStatusModel = require('./../../models/orderStatus.model');
const API = require('./../../APILib');
const utils = require('./../../utils');
const status = require('../../constants/status');

module.exports = async (req, res) => {
  const data = req.body;
  const authInfo = utils.getAuthInfo(req.headers.authorization);
  data.createdBy = authInfo._id;
  const objData = new model(data);

  try {
    const saveOrder = await objData.save();
    const pickup = await orderStatusModel.findOne({value: status.order.PREPAREDELIVERY});
    const pickupId = pickup._id;

    const updateOrder = await orderModel.update(
      { _id : { $in : data.orders }}, 
      { orderstatus: pickup},
      {"multi": true}
    )

    API.success(res, {
        message: 'Success!'
    });
  } catch (err) {
    return API.fail(res, err.message);
  }

};