'use strict';

let async = require('asyncawait/async'),
    await = require('asyncawait/await');
    
var model = require('./../../models/post.model');
var API = require('./../../APILib');

module.exports = async((req, res) => {
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