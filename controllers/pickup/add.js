'use strict';

const PickupModel = require('./../../models/pickup.model');
const orderModel = require('./../../models/order.model');
const API = require('./../../APILib');
const {order: orderStatus, pickup: pickupStatus} = require('../../constants/status');

module.exports = async (req, res) => {
  const data = req.body;

  try {
    //tìm chuyến đi có trạng thái là pending và thuộc về shipper cần tạo
    const pickupTrip = await PickupModel.findOne({status: pickupStatus.PENDING, shipper: data.shipperId}).lean();

    if(pickupTrip){
      const clients = pickupTrip.clients;
      const clientIds = [data.client];
      for(let i=0; i< clients.length; i++){
        const client = clients[i].toString();
        if(client !== data.client){
          clientIds.push(client);
        }
      }
      const updateResult = await PickupModel.findByIdAndUpdate(pickupTrip._id, {clients: clientIds});
    }else{
      //Nếu chưa thì tạo mới chuyến đi
      const addData = {
        shipper: data.shipperId,
        clients: [data.client]
      };
      const objAdd = new PickupModel(addData);
      const addResult = await objAdd.save(req); 
    }

    const updateOrder = await(
      orderModel.update(
          { _id : { $in : data.orders }}, 
          { orderstatus: orderStatus.PICKUP.value}, 
          {"multi": true}
      )
    );

    API.success(res, {});

  } catch (err) {
    API.fail(res, err.message);
  }

};