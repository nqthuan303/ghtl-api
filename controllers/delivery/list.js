'use strict';

var model = require('./../../models/delivery.model');
var API = require('./../../APILib');

module.exports = async (req, res) => {
  const result = await model.find().populate('user', 'name');

};