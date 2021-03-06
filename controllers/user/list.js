'use strict';

var model = require('./../../models/user.model');
var API = require('./../../APILib');

module.exports = async (req, res) => {
  try {
    const result = await model.find().populate('role', 'name');
    API.success(res, result);
  } catch (error) {
    API.fail(res, error.message);
  }
};