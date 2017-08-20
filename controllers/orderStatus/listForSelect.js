'use strict';

var model = require('./../../models/orderStatus.model');
var API = require('./../../APILib');

module.exports = (req, res) => {
    model.find({}, function(err, data) {
    if (err) {
      res.send(err);
    }
    res.json(data);
  });

};