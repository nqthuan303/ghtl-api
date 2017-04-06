var express = require('express');
var router = express.Router();

var model = require('../models/orderStatus.model');

router.get('/listForSelect', function (req, res, next) {
  model.find({}, function(err, data) {
    if (err) {
      res.send(err);
    }
    res.json(data);
  });
});


module.exports = router;