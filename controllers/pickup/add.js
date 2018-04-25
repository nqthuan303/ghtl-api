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
    let pickupId = '';

    if(pickupTrip){
      pickupId = pickupTrip._id;
      const clients = pickupTrip.clients;
      const clientIds = [data.client];
      for(let i=0; i< clients.length; i++){
        const client = clients[i].toString();
        if(client !== data.client){
          clientIds.push(client);
        }
      }

      const updatePickup = await PickupModel.findByIdAndUpdate(pickupTrip._id, {clients: clientIds});
    }else{
      //Nếu chưa thì tạo mới chuyến đi
      const addData = {
        shipper: data.shipperId,
        clients: [data.client]
      };
      const objAdd = new PickupModel(addData);
      const addPickup = await objAdd.save(req);
      pickupId = addPickup._id.toString();
    }

    //cập nhật những pickup khác chứa client được chọn
    const searchPickupRemoveClient = {clients: data.client, _id: { $ne: pickupId }};
    const pickupRemoveClient = await PickupModel.findOne(searchPickupRemoveClient);
    if(pickupRemoveClient){
      const { clients } = pickupRemoveClient;
      const clientIds = [];
      for(let i=0; i< clients.length; i++){
        const client = clients[i];
        if(client.toString() !== data.client){
          clientIds.push(client.toString());
        }
      }
      if(clientIds.length === 0){
        await PickupModel.findOneAndRemove(searchPickupRemoveClient);
      }else{
        await PickupModel.findOneAndUpdate(searchPickupRemoveClient, {clients: clientIds});
      }
      
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