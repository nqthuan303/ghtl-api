'use strict';

var model = require('./../../models/client.model');
var API = require('./../../APILib');

module.exports = async (req, res) => {
    var id = req.params.id;
    try {
        const result = await model.findByIdAndRemove(id);
        API.success(res, {});
    } catch (error) {
        API.fail(res, error);
    }
};