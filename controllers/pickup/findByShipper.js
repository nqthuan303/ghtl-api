'use strict';

var model = require('./../../models/pickup.model');
var API = require('./../../APILib');

module.exports = async (req, res) => {
    var objQuery = req.query;
    const shipperId = req.params.shipperId;

    const pickUps = await model.find({user: shipperId})
        .populate({
            path: 'client',
            select: 'name address phone district',
            populate: { 
                path: 'district',
                select: 'name type',
            }
        })
        .populate({
            path: 'orders',
            select: 'id sender orderstatus',
            populate: {
                path: 'orderstatus',
                select: 'name value'
            }
        })
        .sort({
            'createdAt': -1,
            'user': -1
        })

    API.success(res, pickUps);

};