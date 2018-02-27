'use strict';

const model = require('./../../models/delivery.model');
const orderModel = require('./../../models/order.model');
const orderStatusModel = require('./../../models/orderStatus.model');
const status = require('../../constants/status')
const API = require('./../../APILib');
const utils = require('./../../utils');

module.exports = async (req, res) => {
  const data = req.body;
  const authInfo = utils.getAuthInfo(req.headers.authorization);
  data.createdBy = authInfo._id;
  const objData = new model(data);

  try {
    const saveOrder = await objData.save();
    const prepareDelivery = await orderStatusModel.findOne({value: status.order.PREPARE_DELIVERY});
    const prepareDeliveryId = prepareDelivery._id;

    const updateOrder = await orderModel.update(
      { _id : { $in : data.orders }}, 
      { orderstatus: prepareDeliveryId}, 
      {"multi": true}
    )

    API.success(res, {
        message: 'Success!'
    });
  } catch (err) {
    return API.fail(res, err.message);
  }

};