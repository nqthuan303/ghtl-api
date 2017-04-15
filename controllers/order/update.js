'use strict';

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

var model = require('./../../models/order.model');
var API = require('./../../APILib');

module.exports = async((req, res) => {
    var id = req.params.id;

  var data = req.body;
  model.findOne({
    _id: id
  }, function (err, dataFound) {
    if (err || !dataFound) {
      res.json({
        "statusCode": -1,
        "message": "Error"
      });
    }

    dataFound.update(data, function (err, dataUpdate) {
      var result = {
        "statusCode": -1,
        "message": "Error"
      }
      if (!err) {
        result.statusCode = 0;
        result.message = "Success";
        result.data = {
          'order_id': dataFound._id,
          'orderstatus_id': data.orderstatus_id
        };
      }
      res.json(result);
    });
  });
});