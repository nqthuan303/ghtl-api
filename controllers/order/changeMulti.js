'use strict';

var model = require('./../../models/order.model');
var API = require('./../../APILib');
var utils = require('./../../utils');

module.exports = async (req, res) => {
  var data = req.body;
    try {
        for(let status in data){
            const updateOrder = await model.update(
                { _id : { $in : data[status] }}, 
                { orderstatus: status}, 
                {"multi": true}
              )
        }
        API.success(res, {
            message: 'Cập nhật chuyến đi giao thành công!!!'
        });
    } catch (error) {
        return API.fail(res, err.message);
    }
};