'use strict';

var model = require('./../../models/pickup.model');
var API = require('./../../APILib');
const {order: orderStatus} = require('../../constants/status');

module.exports = async (req, res) => {
    var objQuery = req.query;
    const populateOpt = [
        {
            path: 'clients',
            select: 'id name address phone district ward',
            populate: [
                {
                    path: 'district',
                    select: 'type name'
                },
                {
                    path: 'ward',
                    select: 'type name'
                }
            ]
        },
        {
            path: 'shipper',
            select: 'name phone id'
        },
        {
            path: 'orders',
            populate: [
                {
                    path: 'receiver.district',
                    select: 'type name'
                },
                {
                    path: 'receiver.ward',
                    select: 'type name'
                }
            ],
            options: { sort: { 'createdAt': 1 } }
        },
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