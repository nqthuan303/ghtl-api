'use strict';

var model = require('./../../models/order.model');
var API = require('./../../APILib');

module.exports = (req, res) => {
    var objQuery = req.query;

  model.findById(objQuery.id, function (err, data) {
    if (err) {
      res.send(err);
    }
    res.json(data);
  });

};