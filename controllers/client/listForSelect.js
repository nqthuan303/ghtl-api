'use strict';

var model = require('./../../models/client.model');
var API = require('./../../APILib');

module.exports = (req, res) => {
    model.aggregate([
      { 
        "$project": {
          "_id": false,
          "key": "$_id",
          "value": "$_id",
          "text": "$name",
          'phone_number': true,
          address: true,
          district: true,
          orderType: true
        }
      }
  ], function(err, data) {
    if (err) {
      res.send(err);
    }
    res.json(data);
  });

};