'use strict';

const PickupModel = require('./../../models/pickup.model');
const {order: orderStatus} = require('../../constants/status');

module.exports = async (req, res) => {
    try {
        const id = req.params.id;
        const populateOpt = [
            {
                path: 'data.client',
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
                path: 'data.orders',
                select: '_id id orderstatus client',
                match: { orderstatus: {$in: [orderStatus.PICKUP.value, orderStatus.STORAGE.value]} }
            }
        ];
        const result = await PickupModel.findById(id).populate(populateOpt);
        API.success(res, result);
    } catch (error) {
        API.fail(res, error.message);
    }
}