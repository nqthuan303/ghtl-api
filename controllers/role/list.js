'use strict';

var model = require('./../../models/role.model');
var API = require('./../../APILib');

module.exports = async (req, res) => {
  try {
    const result = await model.find();
    API.success(res, result);
  } catch (error) {
    API.fail(res, error.message);
  }
};