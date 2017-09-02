'use strict';

const model = require('./../../models/pickup.model');
const orderModel = require('./../../models/order.model');
const orderStatusModel = require('./../../models/orderStatus.model');
const API = require('./../../APILib');
const utils = require('./../../utils');

let async = require('asyncawait/async'),
await = require('asyncawait/await');

module.exports = async((req, res) => {
  const data = req.body;
  const authInfo = utils.getAuthInfo(req.headers.authorization);
  data.createdBy = authInfo._id;
  const objData = new model(data);

  try {
    const saveOrder = await(objData.save());
    const receiving = await(orderStatusModel.findOne({value: 'receiving'}));
    const receivingId = receiving._id;

    const updateOrder = await(
        orderModel.update(
            { _id : { $in : data.orders }}, 
            { orderstatus: receivingId}, 
            {"multi": true}
        )
    )   

    API.success(res, {
        message: 'Success!'
    });
  } catch (err) {
    return API.fail(res, err.message);
  }

});