'use strict';

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

var model = require('./../../models/order.model');
var API = require('./../../APILib');

module.exports = async((req, res) => {
    var objQuery = req.query;

  model.findById(objQuery.id, function (err, data) {
    if (err) {
      res.send(err);
    }
    res.json(data);
  });

});