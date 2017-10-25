'use strict';

var model = require('./../../models/orderStatus.model');
var API = require('./../../APILib');

module.exports = (req, res) => {
  model.aggregate([{ 
    "$project": {
        "_id": false,
        "key": "$_id",
        "value": "$_id",
        "text": "$name",
        "name": "$value"
    }
  }], function(err, data) {
  if (err) {
      res.send(err);
    }
    res.json(data);
  });

};