'use strict';

var model = require('./../../models/payment.model');
var API = require('./../../APILib');
var utils = require('./../../utils');
const {payment: paymentStatus} = require('../../constants/status');

module.exports = async (req, res) => {
    var authInfo = utils.getAuthInfo(req.headers.authorization);
    let clientId = '';
    if(!authInfo.role){
        clientId =  authInfo._id;
    }
    try {
        const populateOpt = [
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
                ]
            },
        ];
        const data = await model.find({
            client: clientId,
            status: {$ne: paymentStatus.CANCEL}
        }).populate(populateOpt)
        API.success(res, data);
    } catch (error) {
        API.error(res, error.message);
    }
};