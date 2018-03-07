'use strict';

const model = require('./../../models/client.model');
const API = require('./../../APILib');
const {order: orderStatus} = require('../../constants/status');

module.exports = async (req, res) => {
    var objQuery = req.query;

    var objSearchClient = {$where: 'this.orders.length > 0'}

    if(objQuery.districtId && objQuery.districtId !== 'all') {
        var districtId = objQuery.districtId;
        objSearchClient['district'] = districtId
    }

    const items = await model.find(objSearchClient).populate({
        path: 'orders',
        match: { orderstatus: orderStatus.PENDING.value}
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