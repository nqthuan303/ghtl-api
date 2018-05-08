'use strict';

var model = require('./../../models/order.model');
var API = require('./../../APILib');
const {order: orderStatus} = require('../../constants/status');

function getObjSearch(objQuery) {
  var query = {};

  var arrAnd = [];
  
  if (objQuery.clientId !== "null" && objQuery.clientId !== undefined && objQuery.clientId != 0) {
    arrAnd.push({
      'client': objQuery.clientId
    });
  }

  if (objQuery.orderStatusId !== "null" && objQuery.orderStatusId !== undefined && objQuery.orderStatusId != 0) {
    arrAnd.push({
      'orderstatus': objQuery.orderStatusId
    });
  }

  if (objQuery.keyword && objQuery.keyword !== "null" && objQuery.keyword != '') {
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

  if (objQuery.districtId !== "null" && objQuery.districtId !== undefined && objQuery.districtId != 0) {
    arrAnd.push({
        'district': objQuery.districtId,
    });
  }



  if (objQuery.wardId !== "null" && objQuery.wardId !== undefined && objQuery.wardId != 0)
   {
    arrAnd.push({
      'ward': objQuery.wardId
    })
  }


  if (arrAnd.length > 0) {
    query.$and = arrAnd;
  }
  return query;
}

module.exports = async (req, res) => {
    var objQuery = req.query;

  var recordsPerPage = Number(objQuery.recordsPerPage);
  var page = Number(objQuery.page);
  var skip = (page - 1) * recordsPerPage;

  var objSearch = getObjSearch(objQuery);

  if (objQuery.status) {
    let arrAnd = [];
    
    if(objSearch.$and && objSearch.$and.length > 0) {
      arrAnd = objSearch.$and;
    }

    arrAnd.push({
        'orderstatus': objQuery.status,
    });
    objSearch.$and = arrAnd;
  }

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
    .select('address payBy goodsMoney shipFee id receiver createdAt note client createdBy province district ward orderstatus')
    .limit(recordsPerPage)
    .skip(skip)
    .sort(objSort)
    .exec(function (err, data) {
      if (err) {
        return API.fail(res, err.message);
      }
      API.success(res, data);
    });

};