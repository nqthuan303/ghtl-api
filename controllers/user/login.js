'use strict';

let async = require('asyncawait/async'),
    jwt = require('jsonwebtoken'),
    config = require('../../config'),
    await = require('asyncawait/await');
    
var model = require('./../../models/user.model');
var API = require('./../../APILib');

module.exports = async((req, res) => {
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