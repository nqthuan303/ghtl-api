'use strict';

var model = require('./../../models/order.model');
var utils = require('./../../utils');

var API = require('./../../APILib');

module.exports = (req, res) => {
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
          res.json({});
        }
      });
    }

  });

};