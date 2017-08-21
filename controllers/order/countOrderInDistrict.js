'use strict';

let async = require('asyncawait/async'),
await = require('asyncawait/await');

var model = require('./../../models/order.model');
var districtModel = require('./../../models/district.model');
var API = require('./../../APILib');

module.exports = async((req, res) => {
    var objQuery = req.query;

    const aggregatorOpts = [
        { $unwind: "$sender" },
        { 
            $group: {
                _id: "$sender.district",
                count: { $sum: 1 }
            }
        }
    ]

    let ordersInDistrict = await(model.aggregate(aggregatorOpts));
    let districtIds = [];

    const objCount = {}

    for(let i=0; i< ordersInDistrict.length; i++) {
        const district = ordersInDistrict[i];
        const districtId = district._id.toString();
        objCount[districtId] = district.count;
        districtIds.push(districtId);
    }

    districtModel.find({_id: {$in: districtIds}}).exec(function(err, data) {
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
    });
    
});