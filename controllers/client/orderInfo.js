'use strict';

const model = require('./../../models/order.model');
const API = require('./../../APILib');

module.exports = async (req, res) => {
    const clientId = req.params.clientId;
    try {
        const result = await model.find({client: clientId})
            .populate('client', 'name')
            .populate('createdBy', 'name')
            .populate('province', 'name type')
            .populate('district', 'name type')
            .populate('ward', 'name type')
            .populate('orderstatus', 'name')
            .sort({'createdAt': -1});

        API.success(res, result);
    } catch (err) {
        return API.fail(res, err.message);
    }

};