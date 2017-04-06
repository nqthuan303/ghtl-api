var express = require('express');
var router = express.Router();
var model = require('./../models/user.model');

var jwt= require('jsonwebtoken');
var config = require('../config');
var authService = require('../services/auth');

API = require('./../APILib');

router.get('/list', authService.isAuthenticated, function (req, res, next) {
  
  var objQuery = req.query;

  var recordsPerPage = Number(objQuery.recordsPerPage);
  var page = Number(objQuery.page);
  var skip = (page -1)* recordsPerPage;

  model.find()
    .populate('province_id', 'name type')
    .populate('district_id', 'name type')
    .populate('ward_id', 'name type')
    .limit(recordsPerPage)
    .skip(skip)
    .sort({
      'datetime_added': -1
    })
    .exec(function (err, data) {
      if (err) {
        res.send(err);
      }
      res.json(data);
    });

});

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