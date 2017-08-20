'use strict';

var model = require('./../../models/ward.model');

module.exports = (req, res) => {
    var objQuery = req.query;
  var districtId = objQuery.districtId;

  model.aggregate([
    { $match : { district : districtId } },
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

};