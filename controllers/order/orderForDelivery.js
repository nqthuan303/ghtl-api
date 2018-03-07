'use strict';

var model = require('./../../models/order.model');
const districtModel = require('./../../models/district.model');
var API = require('./../../APILib');
const {order: orderStatus} = require('../../constants/status');

module.exports = async (req, res) => {
    const objSearch = {orderstatus: orderStatus.STORAGE.value};
    let orders = await model.find(objSearch).populate("receiver.district", "_id type name");
    API.success(res, orders);
};