'use strict';
    
var model = require('./../../models/user.model');
var API = require('./../../APILib');
var utils = require('./../../utils');

module.exports = async (req, res) => {
    var id = req.params.id;
    var authInfo = utils.getAuthInfo(req.headers.authorization);
    try {
        const result = await model.findById(id)
        API.success(res, result)
    } catch (error) {
        API.fail(res, error.message)
    }
};