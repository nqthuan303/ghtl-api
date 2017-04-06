var express = require('express');
var router = express.Router();
var model = require('../models/order.model');
var orderLogModel = require('./../models/orderLog.model');
var authService = require('../services/auth');

router.post('/add', authService.isAuthenticated, function (req, res, next) {
  var data = req.body;
  var objData = new model(data);

  var promise = objData.save();

  promise.then(function (doc) {
    var result = {
      "statusCode": -1,
      "message": "Error"
    }
    if (!doc.errors) {
      result.statusCode = 0;
      result.message = "Success";
      result.data = {
        'order_id': doc._id,
        'orderstatus_id': doc.orderstatus_id
      };
    }
    res.json(result);
  });
});

router.put('/update/:id', authService.isAuthenticated, function (req, res, next) {
  var id = req.params.id;

  var data = req.body;
  model.findOne({
    _id: id
  }, function (err, dataFound) {
    if (err || !dataFound) {
      res.json({
        "statusCode": -1,
        "message": "Error"
      });
    }

    dataFound.update(data, function (err, dataUpdate) {
      var result = {
        "statusCode": -1,
        "message": "Error"
      }
      if (!err) {
        result.statusCode = 0;
        result.message = "Success";
        result.data = {
          'order_id': dataFound._id,
          'orderstatus_id': data.orderstatus_id
        };
      }
      res.json(result);
    });
  });
});


router.put('/updateStatus/:id', authService.isAuthenticated, function (req, res, next) {
  var id = req.params.id;

  var data = req.body;

  model.findOne({
    _id: id
  }, function (err, dataFound) {
    if (err || !dataFound) {
      res.json({
        "statusCode": -1,
        "message": "Error"
      });
    }

    if (dataFound.orderstatus_id != data.orderstatus_id) {
      dataFound.update(data, function (err, dataUpdate) {
        var result = {
          "statusCode": -1,
          "message": "Error"
        }
        if (!err) {
          orderLogData = {
            'order_id': id,
            'orderstatus_id': data.orderstatus_id
          };
          var orderLog = new orderLogModel(orderLogData);

          var promise = orderLog.save();

          promise.then(function (doc) {
            if (!doc.errors) {
              result.statusCode = 0;
              result.message = "Success";
              result.data = {
                'order_id': dataFound._id,
                'orderstatus_id': data.orderstatus_id
              };
            }
            res.json(result);
          });

        }
      });
    }

  });
});



router.get('/findOneBy', authService.isAuthenticated, function (req, res, next) {
  var objQuery = req.query;

  model.findById(objQuery.id, function (err, data) {
    if (err) {
      res.send(err);
    }
    res.json(data);
  });

});

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

router.get('/list', authService.isAuthenticated, function (req, res, next) {
  var objQuery = req.query;

  var recordsPerPage = Number(objQuery.recordsPerPage);
  var page = Number(objQuery.page);
  var skip = (page - 1) * recordsPerPage;

  var objSearch = getObjSearch(objQuery);

  var objSort = {
    'datetime_added': -1
  };

  if (objQuery.sortField && objQuery.sortValue) {
    objSort = {};
    objSort[objQuery.sortField] = objQuery.sortValue;
  }
  model.find(objSearch)
    .populate('client_id', 'name')
    .populate('province_id', 'name type')
    .populate('district_id', 'name type')
    .populate('ward_id', 'name type')
    .populate('orderstatus_id', 'name')
    .select('address bonus_fee reciever_name reciever_phone ship_fee datetime_added note client_id province_id district_id ward_id orderstatus_id')
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

router.get('/numOfOrder', authService.isAuthenticated, function (req, res, next) {
  var objQuery = req.query;
  var objSearch = getObjSearch(objQuery);

  model.count(objSearch, function (err, data) {
    if (err) {
      res.send(err);
    }
    res.json(data);
  });
});

module.exports = router;