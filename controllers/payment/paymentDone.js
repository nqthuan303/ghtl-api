'use strict';

var model = require('./../../models/payment.model'),
    orderModel = require('./../../models/order.model'),
    historyModel = require('./../../models/history.model'),
    API = require('./../../APILib');

const {payment, paymentStatus, paymentType} = require('../../constants/status');

module.exports = async (req, res) => {
  const { body: reqData } = req;

  try {
    const endTime = new Date();
    const updateData = {
      status: payment.DONE,
      endTime,
      type: reqData.type,
      money: reqData.money,
    };
    if(reqData.type === paymentType.TRANSFER.value){
      updateData.bank = reqData.bank;
      updateData.bill = reqData.bill;
    }
    const result = await model.findOneAndUpdate(
      {_id: reqData.paymentId}, 
      updateData, 
      {returnNewDocument : true}
    ).populate('orders', '_id orderstatus').lean();
    
    const arrOrderId = [];
    for(let i=0; i< result.orders.length; i++){
      const order = result.orders[i];
      // const objData = new historyModel({
      //   type: 'payment',
      //   typeId: id,
      //   order: order._id,
      //   orderStatus: order.orderstatus,
      // });
      // const save = await objData.save();
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