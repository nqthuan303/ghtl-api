'use strict';

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

var model = require('./../../models/client.model');
var API = require('./../../APILib');

module.exports = async((req, res) => {
    var postData = req.body;
  var objData = new model(postData);

  var promise = objData.save();

  promise.then(function (doc) {
    var result = {
      "statusCode": 0, 
      "message": "Success"
    }
    if(doc.errors){
      result.statusCode = -1;
      result.message = "Error";
    }
    res.json(result);
  });

});