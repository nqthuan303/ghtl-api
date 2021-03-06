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
          'receiver_name': new RegExp(".*" + objQuery.keyword.replace(/(\W)/g, "\\$1") + ".*", "i")
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
    .populate('client', 'name')
    .populate('createdBy', 'name')
    .populate('province', 'name type')
    .populate('district', 'name type')
    .populate('ward', 'name type')
    .select('address bonus_fee receiver_name receiver_phone ship_fee createdAt note client createdBy province district ward orderstatus')
    .limit(recordsPerPage)
    .skip(skip)
    .sort(objSort)
    .exec(function (err, data) {
      if (err) {
        res.send(err);
      }
      res.json(data);
    });

};