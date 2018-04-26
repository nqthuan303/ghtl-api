'use strict';

const PickupModel = require('./../../models/pickup.model');
const {order: orderStatus} = require('../../constants/status');

module.exports = async (req, res) => {
    try {
        const id = req.params.id;
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
                    {
                        path: 'orders',
                        match: { orderstatus: orderStatus.PICKUP.value},
                        options: { sort: { 'createdAt': 1 } }
                    },
                ]
            },
            {
                path: 'shipper',
                select: 'name phone id'
            }
        ];
        const result = await PickupModel.findById(id).populate(populateOpt);
        API.success(res, result);
    } catch (error) {
        API.fail(res, err.message);
    }
}