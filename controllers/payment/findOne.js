'use strict';

var model = require('./../../models/payment.model');
var API = require('./../../APILib');
var utils = require('./../../utils');

module.exports = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await model.findById(id)
        .populate({
            path: 'orders',
            populate: { 
                path: 'receiver.district',
            }
        })
        .populate('client');
        API.success(res, data);
    } catch (error) {
        API.error(res, error.message);
    }
};