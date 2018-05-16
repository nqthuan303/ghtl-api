'use strict';

var PaymentModel = require('./../../models/payment.model');
var API = require('./../../APILib');
const {payment} = require('../../constants/status');
module.exports = async (req, res) => {
    try {
        const data = await PaymentModel
            .find({'status': payment.DONE})
            .populate({
                path: 'orders',
                select: 'id createdAt receiver.address goodsMoney shipFee orderstatus'
            })
            .populate({
                path: 'client',
                select: 'name phone address bankNumber bankAccount bankBranch bankName'
            });

        API.success(res, data);
    } catch (error) {
        API.fail(res, err.message)
    }
};
