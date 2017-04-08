var express = require('express');
var router = express.Router();
var model = require('./../models/user.model');

var jwt= require('jsonwebtoken');
var config = require('../config');
var authService = require('../services/auth');

API = require('./../APILib');

router.get('/list', authService.isAuthenticated, function (req, res, next) {
  
  var objQuery = req.query;

  var objSort = {
    'datetime_added': -1
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
    .populate('province_id', 'name type')
    .populate('district_id', 'name type')
    .populate('ward_id', 'name type')
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

function getObjSearch(objQuery) {
  var query = {};

  var arrAnd = [];

  if (objQuery.keyword !== "null" && objQuery.keyword != '') {
    arrAnd.push({
      '$or': [{
          'name': new RegExp(".*" + objQuery.keyword.replace(/(\W)/g, "\\$1") + ".*", "i")
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

router.post('/login', function(req, res, next) {
    let reqBody = req.body;
    let username = reqBody.username, password = reqBody.password;

    if (!username || !password) return API.fail(res, API.errors.MISSED_FIELD);

    model.findOne({username: username}).select('+password').exec(function(err, data){
      if(!data) return API.fail(res, API.errors.USER_NOT_FOUND);

      data.comparePassword(password, (error, isMatch) => {
          if (error) {
              return API.fail(res, API.errors.UNKNOWN);
          }

          if (!isMatch) {
              return API.fail(res, API.errors.USER_PASSWORD_NOT_MATCH);
          }
          
          var token = jwt.sign(data, config.secret, {
            expiresIn: 18000 // in seconds
          });

          API.success(res, {
              token: 'JWT ' + token,
              name: data.name,
              email: data.email,
              userId: data._id
          });
      });
    });
});

router.delete('/delete/:id', function(req, res, next) {
    var id = req.params.id;
    model.findByIdAndRemove(id, function(err, data){
      if(err) {
          return API.fail(res, API.errors.UNKNOWN);
        }
        API.success(res, {
            message: 'Success!',
            statusCode: 0
        });
      
    })
});

router.post('/add', authService.isAuthenticated, function(req, res, next) {
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

router.put('/update/:id', authService.isAuthenticated, function(req, res, next) {
  var id = req.params.id;

  var data = req.body;
  model.findOneAndUpdate({_id: id}, data, function(err, doc) {
    var result = {
        "statusCode": 0, 
        "message": "Success"
    }
    if(err){
      result.statusCode = -1;
      result.message = "Error";
    }
      res.json(result);
  });
});


router.get('/findOneBy', authService.isAuthenticated, function(req, res, next) {
  var objQuery = req.query;

  model.findById(objQuery.id, function (err, data) {
    if (err) {
      res.send(err);
    }
    res.json(data);
  });

});

router.get('/listForSelect', authService.isAuthenticated, function (req, res, next) {
  model.aggregate([
      { 
        "$project": {
          "_id": false,
          "value": "$_id",
          "label": "$name",
        }
      }
  ], function(err, data) {
    if (err) {
      res.send(err);
    }
    res.json(data);
  });

});

router.get('/numOfUser', authService.isAuthenticated, function(req, res, next) {
  model.count(function(err, data) {
    if (err) {
      res.send(err);
    }
    res.json(data);
  });
});

module.exports = router;