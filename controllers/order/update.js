  'use strict';

  var model = require('./../../models/order.model');
  var API = require('./../../APILib');

  module.exports = async (req, res) => {
    var id = req.params.id;
    var data = req.body;
    try {
      const result = await model.findByIdAndUpdate(id, data, {new: true})
        .populate('client', 'name phone')
        .populate('receiver.district', 'name type')
        .populate('receiver.ward', 'name type');
      API.success(res, result);
    } catch (error) {
      API.fail(res, error.message);
    }
  };