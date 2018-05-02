'use strict';

var model = require('./../../models/user.model');
var API = require('./../../APILib');
var utils = require('./../../utils');

module.exports = async(req, res) => {
  var data = req.body;
  var authInfo = utils.getAuthInfo(req.headers.authorization);
  data.createdBy = authInfo._id;
  var objData = new model(data);
  try {
    var promise = objData.save();
    API.success(res, "Thêm user thành công!!!");
  } catch (error) {
    API.fail(res, error.message);
  }
};