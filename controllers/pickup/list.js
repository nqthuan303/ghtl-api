'use strict';

var model = require('./../../models/pickup.model');
var API = require('./../../APILib');

module.exports = async (req, res) => {
    var objQuery = req.query;
    const populateOpt = [
        {
            path: 'clients',
            select: 'id name address phone district ward orders',
            populate: [
                {
                    path: 'district',
                    select: 'type name'
                },
                {
                    path: 'ward',
                    select: 'type name'
                },
            ]
        },
        {
            path: 'data',
            populate: {
                path: 'clientId'
            }
        },
        {
            path: 'shipper',
            select: 'name phone id'
        },
        {
            path: 'orders',
            select: 'id'
        }
    ];
    const sortOpt = {
        'createdAt': -1,
        'user': -1
    };

    try {
        const pickUps = await model.find().populate(populateOpt).sort(sortOpt);
        API.success(res, pickUps);
    } catch (error) {
        API.fail(res, error.message);
    }
};