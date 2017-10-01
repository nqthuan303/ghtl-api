'use strict';
    
var model = require('./../../models/price.model');
var API = require('./../../APILib');

module.exports = async (req, res) => {
    var id = req.params.id;
    try {
        const result = await model.findByIdAndRemove(id);
        API.success(res, {});
    }catch (err) { return API.fail(res, err.message); }
};