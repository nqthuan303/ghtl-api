'use strict';

var model = require('./../../models/client.model');
var API = require('./../../APILib');
var utils = require('./../../utils');

module.exports = (req, res) => {
  var data = req.body;
  var authInfo = utils.getAuthInfo(req.headers.authorization);
  data.createdBy = authInfo._id;
  var objData = new model(data);

  objData.save(function (err) {
    var result = {
      "statusCode": 0,
      "message": "Success"
    }
    if (err) {
      result.statusCode = -1;
      result.message = "Error";
    }
    res.json(result);
  });

};