'use strict';

var model = require('./../../models/order.model');
var API = require('./../../APILib');
var utils = require('./../../utils');

module.exports = (req, res) => {
  var data = req.body;

  model.update({ _id : { $in : data }}, {inProcess: false}, {"multi": true}, function(err, data) {
        if(err) {
            return API.fail(res, API.errors.UNKNOWN);
        }
        API.success(res, {
            message: 'Success!',
            statusCode: 0
        });
  });

};