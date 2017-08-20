'use strict';

var model = require('./../../models/client.model');
var API = require('./../../APILib');

module.exports = (req, res) => {
    model.count(function(err, data) {
    if (err) {
      res.send(err);
    }
    res.json(data);
  });

};