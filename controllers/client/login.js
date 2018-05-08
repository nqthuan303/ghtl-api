'use strict';

let jwt = require('jsonwebtoken'),
    config = require('../../config');
    
var model = require('./../../models/client.model');
var API = require('./../../APILib');

module.exports = (req, res) => {
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
              info: {
                  name: data.name,
                  username: data.username
              }
          });
      });
    });
};