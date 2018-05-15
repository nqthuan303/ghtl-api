'use strict';

var model = require('./../../models/history.model');
var API = require('./../../APILib');

module.exports = async (req, res) => {
    var objQuery = req.query;
    try {
        const result = await model.find({ order: objQuery.id });
        API.success(res, result);
    } catch (error) {
        API.fail(res, error.message);
    }
};
