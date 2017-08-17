'use strict';

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

var model = require('./../../models/client.model');
var API = require('./../../APILib');


function getObjSearch(objQuery) {
  var query = {};

  var arrAnd = [];

  if (objQuery.keyword !== "null" && objQuery.keyword != '') {
    arrAnd.push({
      '$or': [{
          'name': new RegExp(".*" + objQuery.keyword.replace(/(\W)/g, "\\$1") + ".*", "i")
        },
        {
          'contact_name': new RegExp(".*" + objQuery.keyword.replace(/(\W)/g, "\\$1") + ".*", "i")
        },
        {
          'address': new RegExp(".*" + objQuery.keyword.replace(/(\W)/g, "\\$1") + ".*", "i")
        },
        {
          'phone_number': new RegExp(".*" + objQuery.keyword.replace(/(\W)/g, "\\$1") + ".*", "i")
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

module.exports = async((req, res) => {
    var objQuery = req.query;

  var objSort = {
    'createdAt': -1
  };


  if (objQuery.sortField && objQuery.sortValue) {
    objSort = {};
    objSort[objQuery.sortField] = objQuery.sortValue;
  }

  var objSearch = getObjSearch(objQuery);

  var recordsPerPage = Number(objQuery.recordsPerPage);
  var page = Number(objQuery.page);
  var skip = (page -1)* recordsPerPage;

  model.find(objSearch)
    .populate('user', 'name')
    .populate('province', 'name type')
    .populate('district', 'name type')
    .populate('ward', 'name type')
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