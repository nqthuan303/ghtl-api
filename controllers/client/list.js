'use strict';

var model = require('./../../models/client.model');
var API = require('./../../APILib');

module.exports = async (req, res) => {
  try {
    const result = await model.find()
    .populate('createdBy', 'name')
    .populate('province', 'name type')
    .populate('district', 'name type')
    .populate('ward', 'name type')
    .sort({
      'createdAt': -1
    });
    API.success(res, result);
  } catch (error) {
    API.fail(res, error.message);
  }
};