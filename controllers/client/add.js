'use strict';

var model = require('./../../models/client.model');
var API = require('./../../APILib');
var utils = require('./../../utils');

module.exports = async (req, res) => {
  var data = req.body;
  var authInfo = utils.getAuthInfo(req.headers.authorization);
  data.createdBy = authInfo._id;
  var objData = new model(data);

  try {
    const result = await objData.save();
    API.success(res, {});
  } catch (error) {
    API.fail(res, error.message);
  }
};