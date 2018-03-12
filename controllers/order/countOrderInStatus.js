'use strict';

var model = require('./../../models/order.model');
var API = require('./../../APILib');
const { order: orderStatus } = require('../../constants/status');

module.exports = async (req, res) => {
    var objQuery = req.query;

    const aggregatorOpts = [
        {
            $group: {
                _id: "$orderstatus",
                count: { $sum: 1 }
            }
        }
    ]

    let ordersInStatus = await model.aggregate(aggregatorOpts);
    let statusId = [];

    const objCount = {}

    for(let i=0; i< ordersInStatus.length; i++) {
        const item = ordersInStatus[i];
        objCount[item._id] = item.count;
        statusId.push(item._id);
    }

    const result = [];
    for(const key in orderStatus) {
        const item = orderStatus[key];
        if(objCount[item.value]){
            result.push({
                value: item.value,
                name: item.name,
                count: objCount[item.value]
            });
        }
    }
    res.json(result);


};
