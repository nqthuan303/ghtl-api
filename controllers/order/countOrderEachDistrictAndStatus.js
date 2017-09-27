'use strict';

var model = require('./../../models/order.model');
const orderStatusModel = require('./../../models/orderStatus.model');
const districtModel = require('./../../models/district.model');
var API = require('./../../APILib');
// count order in sender district with status 'storage'
module.exports = async (req, res) => {

    var objQuery = req.query;

    const orderStatus = await orderStatusModel.findOne({value: objQuery.status});
    const statusId = orderStatus._id;

    const aggregatorOpts = [
        {
            $match:{
                orderstatus: statusId
            }
        },
        {
            $group: {
                _id: "$reciever.district",
                count: { $sum: 1 }
            }
        }
    ]
    let ordersInDistrict = await model.aggregate(aggregatorOpts);
    let result = [];
    for(let i =0; i<ordersInDistrict.length; i++){
        let order = ordersInDistrict[i];
        const district = await districtModel.findOne({_id: order._id});
        result.push({
            _id: district._id,
            name: district.name,
            count: order.count
        })
    }
    if(result){
        API.success(res, result);
    }
};