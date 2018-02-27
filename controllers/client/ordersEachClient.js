'use strict';

const model = require('./../../models/client.model');
const orderStatusModel = require('./../../models/orderStatus.model');
const API = require('./../../APILib');
const status = require('../../constants/status');

module.exports = async (req, res) => {
    var objQuery = req.query;

    const orderStatusPending = await orderStatusModel.findOne({value: status.order.PENDING});
    const pendingId = orderStatusPending._id;

    var objSearchClient = {$where: 'this.orders.length > 0'}

    if(objQuery.districtId && objQuery.districtId !== 'all') {
        var districtId = objQuery.districtId;
        objSearchClient['district'] = districtId
    }

    const items = await model.find(objSearchClient).populate({
        path: 'orders',
        match: { orderstatus: pendingId}
    }).populate('district', 'name type');

    const result = [];
    for(let i=0; i< items.length; i++){
        const item = items[i];
        const { orders } = item;
        if(orders.length > 0){
            result.push(item);
        }
    }

    API.success(res, result);

};