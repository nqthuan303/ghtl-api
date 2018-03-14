'use strict';

var model = require('./../../models/pickup.model');
var API = require('./../../APILib');

module.exports = async (req, res) => {
    var objQuery = req.query;

    try {
        const pickUps = await model.find()
        .populate({
            path: 'client',
            select: 'name address phone district',
            populate: { 
                path: 'district',
                select: 'name type',
            }
        })
        .populate({
            path: 'data',
            populate: {
                path: 'clientId'
            }
        })
        .populate('shipper', 'name phone id')
        .populate('orders', 'id')
        .sort({
            'createdAt': -1,
            'user': -1
        });
        API.success(res, pickUps);

    } catch (error) {
        API.fail(res, error.message);
    }
};