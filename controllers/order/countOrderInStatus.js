'use strict';

var model = require('./../../models/order.model');
var API = require('./../../APILib');

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
        const orderstatus = ordersInStatus[i];
        const orderstatusId = orderstatus._id.toString();
        objCount[orderstatusId] = orderstatus.count;
        statusId.push(orderstatusId);
    }

    const result = [];
    for(let i=0; i< data.length; i++) {
        const item = data[i];
        const itemId = item._id.toString();

        result.push({
            _id: item._id.toString(),
            name: item.name,
            count: objCount[itemId]
        });
    }
    res.json(result);


};
