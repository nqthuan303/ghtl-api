'use strict';

var model = require('./../../models/client.model');
var paymentModel = require('./../../models/payment.model');
var API = require('./../../APILib');

module.exports = async (req, res) => {
  var objParams = req.params;
  try {
    const result = await model
    .findById(objParams.id)
    .select(`
      id name username status email
      contactName district descriptionOfGoods 
      ward address phone password
      website bankNumber 
      bankAccount bankBranch 
      bankName isCod`
    )
    API.success(res, result);
  } catch (error) {
    API.fail(res, error);
  }
  
};