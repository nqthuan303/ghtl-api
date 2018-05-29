'use strict';

var model = require('./../../models/client.model');
var API = require('./../../APILib');
var utils = require('./../../utils');

module.exports = async (req, res) => {
    var authInfo = utils.getAuthInfo(req.headers.authorization);
    let clientId = '';
    if(!authInfo.role){
        clientId =  authInfo._id;
    }
    var data = req.body;

    try {
        const result = await model.findOneAndUpdate({_id: clientId}, data, {returnNewDocument : true});
        API.success(res, data);

    } catch (error) {
        API.fail(res, error);
    }
};