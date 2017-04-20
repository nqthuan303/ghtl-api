'use strict';

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

var model = require('./../../models/order.model');
var API = require('./../../APILib');

function getObjSearch(objQuery) {
  var query = {};

  var arrAnd = [{
      'orderstatus_id': '5884a5ba7b66847851a42725'
    }];
  
  if (objQuery.clientId !== "null" && objQuery.clientId !== undefined && objQuery.clientId != 0) {
    arrAnd.push({
      'client_id': objQuery.clientId
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

module.exports = async((req, res) => {
    var objQuery = req.query;

  var recordsPerPage = Number(objQuery.recordsPerPage);
  var page = Number(objQuery.page);
  var skip = (page - 1) * recordsPerPage;

  var objSearch = getObjSearch(objQuery);

  var objSort = {
    'createdAt': -1
  };

  if (objQuery.sortField && objQuery.sortValue) {
    objSort = {};
    objSort[objQuery.sortField] = objQuery.sortValue;
  }
  model.find(objSearch)
    .populate('client_id', 'name')
    .populate('createdBy', 'name')
    .populate('province_id', 'name type')
    .populate('district_id', 'name type')
    .populate('ward_id', 'name type')
    .populate('orderstatus_id', 'name')
    .select('address bonus_fee reciever_name reciever_phone ship_fee createdAt note client_id createdBy province_id district_id ward_id orderstatus_id')
    .limit(recordsPerPage)
    .skip(skip)
    .sort(objSort)
    .exec(function (err, data) {
      if (err) {
        res.send(err);
      }
      res.json(data);
    });

});