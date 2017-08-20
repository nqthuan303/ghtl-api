'use strict';

var model = require('./../../models/order.model');
var API = require('./../../APILib');

function getObjSearch(objQuery) {
  var query = {};

  var arrAnd = [{
      'orderstatus': '5884a5ba7b66847851a42725'
    }];
  
  if (objQuery.clientId !== "null" && objQuery.clientId !== undefined && objQuery.clientId != 0) {
    arrAnd.push({
      'client': objQuery.clientId
    });
  }

  if (objQuery.keyword !== "null" && objQuery.keyword != '') {
    arrAnd.push({
      '$or': [{
          'reciever_name': new RegExp(".*" + objQuery.keyword.replace(/(\W)/g, "\\$1") + ".*", "i")
        },
        {
          'address': new RegExp(".*" + objQuery.keyword.replace(/(\W)/g, "\\$1") + ".*", "i")
        } 
      ]
    });
  }


  if (arrAnd.length > 0) {
    query.$and = arrAnd;
  }
  return query;
}


module.exports = (req, res) => {
  var objQuery = req.query;
  var objSearch = getObjSearch(objQuery);

  model.count(objSearch, function (err, data) {
    if (err) {
      res.send(err);
    }
    res.json(data);
  });

};