var express = require('express');
var router = express.Router();

var model = require('../models/district.model');

router.get('/listForSelect', function (req, res, next) {
  var objQuery = req.query;
  var provinceId = objQuery.provinceId;

  model.aggregate([{
      $match: {
        province_id: provinceId
      }
    },
    {
      "$project": {
        "_id": false, //KHông lấy _id ra 
        "value": "$_id",
        "label": {
          $concat: ["$type", " ", "$name"] // nối cột
        }
      }
    }
  ], function (err, data) {
    if (err) {
      res.send(err);
    }
    res.json(data);
  });

});


module.exports = router;