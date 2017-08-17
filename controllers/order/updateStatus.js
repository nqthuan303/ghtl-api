'use strict';

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

var model = require('./../../models/order.model');
var orderLogModel = require('./../../models/orderLog.model');
var utils = require('./../../utils');

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

    if (dataFound.orderstatus_id != data.orderstatus_id) {
      dataFound.update(data, function (err, dataUpdate) {
        var result = {
          "statusCode": -1,
          "message": "Error"
        }
        if (!err) {
          var authInfo = utils.getAuthInfo(req.headers.authorization);
          var orderLogData = {
            'order_id': id,
            'orderstatus_id': data.orderstatus_id,
            'user': authInfo._id
          };

          var orderLog = new orderLogModel(orderLogData);

          orderLog.save(function(err) {
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

        }
      });
    }

  });

});