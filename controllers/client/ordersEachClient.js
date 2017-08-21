'use strict';

const async = require('asyncawait/async'),
await = require('asyncawait/await');

const model = require('./../../models/client.model');
const orderStatusModel = require('./../../models/orderStatus.model');

const API = require('./../../APILib');

module.exports = async((req, res) => {
    const objQuery = req.query;

    const orderStatusPending = await(orderStatusModel.findOne({value: 'pending'}));
    const pendingId = orderStatusPending._id;

    model.find({}).populate({
        path: 'orders',
        match: { orderstatus: pendingId}
    }).exec(function(err, data) {
        if (err) {
            return API.fail(res, err);
        }
        API.success(res, data);
    }) 

});