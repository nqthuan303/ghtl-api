  'use strict';

  var model = require('./../../models/order.model');
  var API = require('./../../APILib');

  module.exports = async (req, res) => {
    var id = req.params.id;
    var data = req.body;
    try {
      await model.findByIdAndUpdate(id, data);
      API.success(res, {});
    } catch (error) {
      API.fail(res, error.message);
    }
  };