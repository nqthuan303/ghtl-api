'use strict';

var model = require('./../../models/delivery.model');
var API = require('./../../APILib');
var utils = require('./../../utils');

module.exports = (req, res) => {
var objParams = req.params;
var authInfo = utils.getAuthInfo(req.headers.authorization);

model.findById(objParams.id)
    .populate({
        path: 'orders',
        populate: { 
            path: 'receiver.district',
        }
    })
    .exec(function(err, data){
        if (err) {
            API.error(res, err.message);
        }
        API.success(res, data);
    });
};