'use strict';

var model = require('./../../models/order.model');
var API = require('./../../APILib');
const { order: orderStatus } = require('../../constants/status');

module.exports = async (req, res) => {
  var data = req.body;
  try {
    const updateData = {
      orderstatus: orderStatus.PENDING.value
    }
    const result = await model.update(
        { _id : { $in : data }}, 
        updateData,
        {"multi": true}
    );
    API.success(res, {
        message: 'Success!',
        statusCode: 0
    });
  } catch (error) {
    return API.fail(res, error.message);
  }
};