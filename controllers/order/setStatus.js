'use strict';

var model = require('./../../models/order.model');
var API = require('./../../APILib');
var utils = require('./../../utils');

module.exports = async (req, res) => {
  var data = req.body;
  var objQuery = req.query;

  model.update(
      { _id : { $in : data }}, 
      {orderstatus: objQuery.status}, 
      {"multi": true}, 
      function(err, data) {
        if(err) {
            return API.fail(res, API.errors.UNKNOWN);
        }
        API.success(res, {
            message: 'Success!',
            statusCode: 0
        });
  });

};