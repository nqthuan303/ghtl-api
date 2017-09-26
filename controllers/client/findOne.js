'use strict';

var model = require('./../../models/client.model');
var API = require('./../../APILib');

module.exports = (req, res) => {
  var objParams = req.params;

  model.findById(objParams.id, function (err, data) {
    if (err) {
      return API.fail(res, err);
    }
    API.success(res, data);
  });

};