var express = require('express');
var router = express.Router();
var model = require('../models/province.model');

router.get('/listForSelect', function (req, res, next) {

  model.aggregate([
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