'use strict';

const PickupModel = require('./../../models/pickup.model');
const orderModel = require('./../../models/order.model');
const API = require('./../../APILib');
const {order: orderStatus, pickup: pickupStatus} = require('../../constants/status');

module.exports = async (req, res) => {
  const { body: reqData } = req;
  const { orders: reqOrders, client: reqClient, shipperId: reqShipper } = reqData;

  try {
    const { PICKUP } = orderStatus;
    const { INPROCESS } = pickupStatus;
    //tìm chuyến đi có trạng thái là pending và thuộc về shipper cần tạo
    const objPickup = await PickupModel.findOne({status: INPROCESS, shipper: reqShipper}).lean();
    
    if(objPickup){
      const { data: pickupDatas } = objPickup;

      let findClient = false;
      const dataUpdate = Object.assign([], pickupDatas);
      for(let i=0; i< pickupDatas.length; i++){
        const pickupData = pickupDatas[i];
        const { client, orders } = pickupData;
        if(client.toString() === reqClient){
          findClient = true;
          const orderIds = [];
          for(let i=0; i< orders.length; i++){
            const orderId = orders[i].toString();
            orderIds.push(orderId);
          }
          for(let i=0; i< reqOrders.length; i++){
            if(orderIds.indexOf(reqOrders[i]) === -1){
              orderIds.push(reqOrders[i]);
            }
          }
          dataUpdate[i] = {
            client: reqClient,
            orders: orderIds
          };
        }
      }

      if(!findClient){
        dataUpdate.push({
            client: reqClient,
            orders: reqOrders
          }
        );
      }
      await PickupModel.findByIdAndUpdate(objPickup._id, {data: dataUpdate});
    }else{
      //Nếu chưa thì tạo mới chuyến đi
      const addData = {
        shipper: reqShipper,
        data: [{
          client: reqClient,
          orders: reqOrders
        }]
      };
      const objAdd = new PickupModel(addData);
      const addPickup = await objAdd.save(req);
    }
    await orderModel.update({_id : {$in : reqOrders}}, {orderstatus: PICKUP.value}, {"multi": true});

    API.success(res, {});

  } catch (err) {
    API.fail(res, err.message);
  }

};