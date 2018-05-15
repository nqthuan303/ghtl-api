'use strict';

var model = require('./../../models/client.model');
var paymentModel = require('./../../models/payment.model');
var API = require('./../../APILib');

module.exports = async (req, res) => {
  var objQuery = req.query;
  try {
    const result = await model.findOne({username: objQuery.username}).select('_id username name')
    API.success(res, result);
  } catch (error) {
    API.fail(res, error);
  }
};