'use strict';

var model = require('./../../models/payment.model');
var API = require('./../../APILib');

module.exports = async (req, res) => {
  var id = req.params.id;
  var postData = req.body;
  try {
    const result = await model.findOneAndUpdate({_id: id}, postData);
    API.success(res, "Cập nhật mã giao dịch thành công.");
  } catch (error) {
    API.fail(res, error);
  }
};