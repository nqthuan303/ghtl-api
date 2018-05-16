'use strict';

var model = require('./../../models/payment.model');
var API = require('./../../APILib');
const {paymentMethods} = require('../../constants/status');

module.exports = async (req, res) => {
  var id = req.params.id;
  var postData = req.body;
  const unsetData = {};
  const dataUpdate = { $set: postData };
  if(postData.method === paymentMethods.CASH.value){
    dataUpdate.$unset = {
      bank: 1,
      bill: 1,
    }
  }
  try {
    const result = await model.findOneAndUpdate({_id: id}, dataUpdate, {new: true});
    API.success(res, result);
  } catch (error) {
    API.fail(res, error.message);
  }
};