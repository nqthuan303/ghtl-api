  'use strict';

  var model = require('./../../models/order.model');
  var API = require('./../../APILib');

  module.exports = async (req, res) => {
    const id = req.params.id;
    try {
      const order = await model.findById(id).populate({
        path: 'client',
        select: 'phone address district',
        populate: {
          path: 'district',
          select: 'name type'
        }
      });
      API.success(res, order); 
    } catch (error) {
      API.fail(res, error.message)
    }
  };