'use strict';

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

var model = require('./../../models/order.model');
var API = require('./../../APILib');
var utils = require('./../../utils');

module.exports = async((req, res) => {
  var data = req.body;
  var authInfo = utils.getAuthInfo(req.headers.authorization);
  data.user = authInfo._id;
  var objData = new model(data);

  var promise = objData.save();

  promise.then(function (doc) {
    var result = {
      "statusCode": -1,
      "message": "Error"
    }
    if (!doc.errors) {
      result.statusCode = 0;
      result.message = "Success";
      result.data = {
        'order_id': doc._id,
        'orderstatus_id': doc.orderstatus_id
      };
    }
    res.json(result);
  });

});