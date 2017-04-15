'use strict';

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

var model = require('./../../models/user.model');
var API = require('./../../APILib');

module.exports = async((req, res) => {
    var postData = req.body;

  var objData = new model(postData);

  objData.save(function() {
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