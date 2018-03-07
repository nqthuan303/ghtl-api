'use strict';

var model = require('./../../models/delivery.model');
var orderModel = require('./../../models/order.model');
var API = require('./../../APILib');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const {order: orderStatus} = require('../../constants/status');

module.exports = async (req, res) => {
    const id = req.params.id;
    try {
        const delivery = await (model.findOne({_id: id}))
        const deleteDelivery = await model.findByIdAndRemove(id);   

        const updateOrder = await (orderModel.update(
            {_id : {$in: delivery.orders}},
            {orderstatus: orderStatus.STORAGE.value}, {"multi": true}
        ));
        API.success(res, {
            message: 'Xóa chuyến đi giao thành công!!!'
        });

      } catch (err) {
        return API.fail(res, err.message);
      }

};