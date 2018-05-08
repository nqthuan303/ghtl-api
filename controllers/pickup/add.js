'use strict';

const PickupModel = require('./../../models/pickup.model');
const orderModel = require('./../../models/order.model');
const API = require('./../../APILib');
const {order: orderStatus, pickup: pickupStatus} = require('../../constants/status');

module.exports = async (req, res) => {
  const data = req.body;
  const { orders: receivedOrders } = data;
  try {
    const { PICKUP } = orderStatus;
    const { INPROCESS } = pickupStatus;
    //tìm chuyến đi có trạng thái là pending và thuộc về shipper cần tạo
    const pickupTrip = await PickupModel.findOne({status: INPROCESS, shipper: data.shipperId}).lean();
    let pickupId = '';

    if(pickupTrip){
      pickupId = pickupTrip._id;
      const { clients, orders } = pickupTrip;
      const clientIds = [data.client];
      for(let i=0; i< clients.length; i++){
        const client = clients[i].toString();
        if(client !== data.client){
          clientIds.push(client);
        }
      }
      const orderIds = [];
      for(let i=0; i< orders.length; i++){
        const orderId = orders[i].toString();
        orderIds.push(orderId);
      }
      for(let i=0; i< receivedOrders.length; i++){
        if(orderIds.indexOf(receivedOrders[i]) === -1){
          orderIds.push(receivedOrders[i]);
        }
      }

      await PickupModel.findByIdAndUpdate(pickupTrip._id, {clients: clientIds, orders: orderIds});
    }else{
      //Nếu chưa thì tạo mới chuyến đi
      const addData = {
        shipper: data.shipperId,
        clients: [data.client],
        orders: receivedOrders
      };
      const objAdd = new PickupModel(addData);
      const addPickup = await objAdd.save(req);
      pickupId = addPickup._id.toString();
    }
    await orderModel.update({_id : {$in : data.orders}}, {orderstatus: PICKUP.value}, {"multi": true});

    API.success(res, {});

  } catch (err) {
    API.fail(res, err.message);
  }

};