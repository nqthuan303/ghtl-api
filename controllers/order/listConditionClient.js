'use strict';

var model = require('./../../models/order.model');
var API = require('./../../APILib');
var utils = require('./../../utils');
var {order: orderStatus} = require('../../constants/status');

module.exports = async (req, res) => {
    var authInfo = utils.getAuthInfo(req.headers.authorization);
    let clientId = '';
    if(!authInfo.role){
        clientId =  authInfo._id;
    }else{
        API.fail(res, 'Bạn cần đăng nhập lại!')
    }
    const data = req.body;
    let objSearch = {
        client: clientId
    };
    if(data.orderstatus && data.orderstatus.length>0){
        objSearch.orderstatus= {$in: data.orderstatus}
    }
    if(data.paymentStatus && data.paymentStatus.length>0){
        objSearch.paymentStatus= {$in: data.paymentStatus}
    }
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