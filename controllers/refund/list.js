'use strict';

var model = require('./../../models/refund.model');
var API = require('./../../APILib');

module.exports = (req, res) => {
  model.find()
      .populate('user', 'name phone_number')
      .populate({
          path: 'orders',
          populate:{
              path: 'sender.district',
              select: '_id type name'
          }
      })
      .exec(function (err, data) {
          if (err) {
              API.fail(res, err.message)
          }
          API.success(res, data);
      });
};
