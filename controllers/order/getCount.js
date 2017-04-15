'use strict';

let async = require('asyncawait/async'),
  await = require('asyncawait/await');

var model = require('./../../models/order.model');
var API = require('./../../APILib');

function getObjSearch(objQuery) {
  var query = {};

  var arrAnd = [];
  
  if (objQuery.clientId !== "null" && objQuery.clientId !== undefined && objQuery.clientId != 0) {
    arrAnd.push({
      'client_id': objQuery.clientId
    });
  }

  if (objQuery.orderStatusId !== "null" && objQuery.orderStatusId !== undefined && objQuery.orderStatusId != 0) {
    arrAnd.push({
      'orderstatus_id': objQuery.orderStatusId
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

  if (objQuery.districtId !== "null" && objQuery.districtId !== undefined && objQuery.districtId != 0) {
    arrAnd.push({
        'district_id': objQuery.districtId,
    });
  }

  if (objQuery.wardId !== "null" && objQuery.wardId !== undefined && objQuery.wardId != 0)
   {
    arrAnd.push({
      'ward_id': objQuery.wardId
    })
  }


  if (arrAnd.length > 0) {
    query.$and = arrAnd;
  }
  return query;
}


module.exports = async((req, res) => {
  var objQuery = req.query;
  var objSearch = getObjSearch(objQuery);

  model.count(objSearch, function (err, data) {
    if (err) {
      res.send(err);
    }
    res.json(data);
  });

});