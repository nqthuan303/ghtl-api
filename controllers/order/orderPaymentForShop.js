'use strict';

var model = require('./../../models/order.model');
var API = require('./../../APILib');
var utils = require('./../../utils');
var {order: orderStatus,paymentStatus} = require('../../constants/status');

module.exports = async (req, res) => {
    var authInfo = utils.getAuthInfo(req.headers.authorization);
    let clientId = '';
    if(!authInfo.role){
        clientId =  authInfo._id;
    }
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
        ]},
        client: clientId
    };
    try {
        const populateOpt = [
            {
                path: 'receiver.district',
                select: 'type name'
            },
            {
                path: 'receiver.ward',
                select: 'type name'
            }
        ]
        let orders = await model.find(objSearch).select('id receiver createdAt orderstatus goodsMoney payBy shipFee').populate(populateOpt);
        API.success(res, orders);
    } catch (error) {
        API.fail(res, error.message)
    }
};