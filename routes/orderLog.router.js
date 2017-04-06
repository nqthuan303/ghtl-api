var express = require('express');
var router = express.Router();
var model = require('./../models/orderLog.model');
var authService = require('../services/auth');

router.post('/add', authService.isAuthenticated, function (req, res, next) {
  var postData = req.body;

  var objData = new model(postData);
  var promise = objData.save();

  promise.then(function (doc) {
    var result = {
      "statusCode": 0,
      "message": "Success"
    }
    if (doc.errors) {
      result.statusCode = -1;
      result.message = "Error";
    }
    res.json(result);
  });
});

module.exports = router;