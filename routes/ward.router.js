var express = require('express');
var router = express.Router();
var model = require('../models/ward.model');

router.get('/listForSelect', function (req, res, next) {
  var objQuery = req.query;
  var districtId = objQuery.districtId;

  model.aggregate([
    { $match : { district_id : districtId } },
      { 
        "$project": {
          "_id": false,
          "value": "$_id",
          "label": { $concat: [ "$type", " ", "$name" ] }
        }
      }
  ], function(err, data) {
    if (err) {
      res.send(err);
    }
    res.json(data);
  });

});


module.exports = router;