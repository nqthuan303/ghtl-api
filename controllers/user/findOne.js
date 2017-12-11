'use strict';
    
var model = require('./../../models/user.model');
var API = require('./../../APILib');
var utils = require('./../../utils');

module.exports = (req, res) => {
    var objQuery = req.query;
    var authInfo = utils.getAuthInfo(req.headers.authorization);

    model.findById(objQuery.id, function (err, data) {
        if (err) {
        res.send(err);
        }
        res.json(data);
    });
};