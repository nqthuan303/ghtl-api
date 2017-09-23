'use strict';

const async = require('asyncawait/async'),
await = require('asyncawait/await');

var model = require('./../../models/client.model');
const orderStatusModel = require('./../../models/orderStatus.model');
var API = require('./../../APILib');

module.exports = async((req, res) => {

    var objQuery = req.query;

    const orderStatusPending = await(orderStatusModel.findOne({value: objQuery.orderStatus}));
    const pendingId = orderStatusPending._id;

    var objSearchClient = {}

    if(objQuery.districtId) {
        var districtId = objQuery.districtId;
        objSearchClient['district'] = ObjectId(districtId);;
    }

    model.find(objSearchClient).populate({
        path: 'orders',
        match: { orderstatus: pendingId}
    }).populate('district').sort({district: -1}).exec(function(err, data) {
        if (err) {
            return API.fail(res, err);
        }
        var result = []
        var count = 1;

        var id = '';

        for(var i=0; i< data.length; i++) {
            const item = data[i];
            if(item.orders.length === 0){
                continue;
            } 
            const district = item.district;
            const districtId = district._id.toString();

            if(id !== districtId) {
                id = districtId;
                count=1
            }else {
                count++;
            }

            const nextData = data[i+1];


            if(nextData) {
                const nextDistrict = nextData.district;
                const nextDistrictId = nextDistrict._id.toString();

                if(nextDistrictId !== districtId) {
                    result.push({
                        _id: districtId,
                        name: district.name,
                        count: count
                    })
                }
            }else {
                result.push({
                    _id: districtId,
                    name: district.name,
                    count: count
                })
            }

        }

        API.success(res, result);
    });
    
});