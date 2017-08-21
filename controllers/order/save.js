'use strict';

let async = require('asyncawait/async'),
await = require('asyncawait/await');

var model = require('./../../models/order.model');
var orderStatusModel = require('./../../models/orderStatus.model');
var API = require('./../../APILib');
var utils = require('./../../utils');

module.exports = async((req, res) => {
  var data = req.body;
  const orderStatusPending = await(orderStatusModel.findOne({value: 'pending'}));
  const pendingId = orderStatusPending._id;

  model.update({ _id : { $in : data }}, {orderstatus: pendingId}, {"multi": true}, function(err, data) {
        if(err) {
            return API.fail(res, API.errors.UNKNOWN);
        }
        API.success(res, {
            message: 'Success!',
            statusCode: 0
        });
  });

});