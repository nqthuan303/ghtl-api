'use strict';

var model = require('./../../models/order.model');
const districtModel = require('./../../models/district.model');
var API = require('./../../APILib');
const {order: orderStatus, paymentStatus} = require('../../constants/status');

module.exports = async (req, res) => {
    const objSearch = {
        orderstatus: {$in: [
            orderStatus.DELIVERED.value,
            orderStatus.RETURNFEESTORAGE.value,
            orderStatus.RETURNFEEPREPARE.value,
            orderStatus.RETURNINGFEE.value,
            orderStatus.RETURNEDFEE.value,
            orderStatus.RETURNSTORAGE.value,
            orderStatus.RETURNPREPARE.value,
            orderStatus.RETURNING.value,
            orderStatus.RETURNED.value,
        ]},
        paymentStatus: {$in: [
            paymentStatus.PENDING.value,
            paymentStatus.UNPAID.value,
        ]}
    };
    try {
        let orders = await model.find(objSearch).populate("sender.district", "_id type name");
        API.success(res, orders);
    } catch (error) {
        API.fail(res, error.message)
    }
};