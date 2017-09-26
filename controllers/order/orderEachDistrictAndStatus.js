'use strict';

const model = require('./../../models/order.model');

const orderStatusModel = require('./../../models/orderStatus.model');

const API = require('./../../APILib');

module.exports = async (req, res) => {
    var objQuery = req.query;

    const orderStatus = await orderStatusModel.findOne({value: objQuery.status});
    const pendingId = orderStatusPending._id;
    const statusId = orderStatus._id;

    var objSearch = {$where: 'this.orders.length > 0'}
    objSearch.orderStatus = statusId
    if(objQuery.districtId && objQuery.districtId !== 'all') {
        var districtId = objQuery.districtId;
        objSearch.sender['district'] = districtId
    }

    model.find(objSearch)
    .exec(function(err, data) {
        if (err) {
            return API.fail(res, err);
        }
        API.success(res, data);
    });

};