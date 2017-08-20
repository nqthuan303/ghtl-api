'use strict';
    
var model = require('./../../models/user.model');
var API = require('./../../APILib');

module.exports = (req, res) => {
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
};