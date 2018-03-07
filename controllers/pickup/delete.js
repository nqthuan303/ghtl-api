'use strict';

var model = require('./../../models/pickup.model');
var orderModel = require('./../../models/order.model');
var API = require('./../../APILib');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const {order: orderStatus} = require('../../constants/status');

module.exports = async (req, res) => {
    const id = req.params.id;
    var orderIds = req.body;

    try {
        
        const deletePickup = await model.findByIdAndRemove(id);

        const updateOrder = await orderModel.update(
            {_id : {$in: orderIds.map(function(o){ return ObjectId(o); })}},
            {orderstatus: orderStatus.PENDING.value}, {"multi": true}
        )

        API.success(res, {
            message: 'Xóa chuyến đi lấy thành công!!!'
        });

      } catch (err) {
        return API.fail(res, err.message);
      }

};