'use strict';

var model = require('./../../models/order.model');
var API = require('./../../APILib');

module.exports = async (req, res) => {
  const data = req.body;
  try {
    const result = await model.updateMany({_id: {$in:  data.orderIds}}, {orderstatus: data.status});
    API.success(res, {
        message: 'Success!',
        statusCode: 0
    });
  } catch (error) {
    API.fail(res, error.message);
  }
};