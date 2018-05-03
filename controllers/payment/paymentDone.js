'use strict';

var model = require('./../../models/payment.model'),
    orderModel = require('./../../models/order.model'),
    historyModel = require('./../../models/history.model'),
    API = require('./../../APILib');

const {payment, paymentStatus} = require('../../constants/status');

module.exports = async (req, res) => {
  var id = req.params.id;
  var objQuery = req.query;
  try {
    const endTime = new Date();
    const result = await model.findOneAndUpdate({_id: id}, {
      status: payment.DONE,
      endTime,
      bill: objQuery.bill,
      bank: objQuery.bank,
      money: objQuery.money,
    }, {returnNewDocument : true}).populate('orders', '_id orderstatus').lean();
    
    const arrOrderId = [];
    for(let i=0; i< result.orders.length; i++){
      const order = result.orders[i];
      const objData = new historyModel({
        type: 'payment',
        typeId: id,
        order: order._id,
        orderStatus: order.orderstatus,
      });
      const save = await objData.save();
      arrOrderId.push(order._id)
    }
    const updateOrder = await orderModel.update(
      { _id : { $in : arrOrderId }}, 
      { paymentStatus: paymentStatus.PAID.value}, 
      {"multi": true}
    )
    API.success(res, "Bảng kê đã được thanh toán thành công!!!");
  } catch (error) {
    API.fail(res, error.message);
  }
  
};