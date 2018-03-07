'use strict';

var model = require('./../../models/order.model');
const districtModel = require('./../../models/district.model');
var API = require('./../../APILib');
const {order: orderStatus} = require('../../constants/status');

module.exports = async (req, res) => {
    const objSearch = {
        orderstatus: {$in: [
            orderStatus.RETURNFEESTORAGE.value, 
            orderStatus.RETURNSTORAGE.value
        ]}
    };
    let orders = await model.find(objSearch).populate("sender.district", "_id type name");
    if(orders){
        API.success(res, orders);
    }
};