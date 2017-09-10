'use strict';

const async = require('asyncawait/async'),
await = require('asyncawait/await');

const model = require('./../../models/client.model');

const orderStatusModel = require('./../../models/orderStatus.model');

const API = require('./../../APILib');

module.exports = async((req, res) => {
    var objQuery = req.query;

    const orderStatusPending = await(orderStatusModel.findOne({value: 'pending'}));
    const pendingId = orderStatusPending._id;

    var objSearchClient = {$where: 'this.orders.length > 0'}

    if(objQuery.districtId && objQuery.districtId !== 'all') {
        var districtId = objQuery.districtId;
        objSearchClient['district'] = districtId
    }

    model.find(objSearchClient)
    .populate({
        path: 'orders',
        match: { orderstatus: pendingId}
    }).populate('district', 'name type')
    .exec(function(err, data) {
        if (err) {
            return API.fail(res, err);
        }
        API.success(res, data);
    });

});