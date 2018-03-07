'use strict';

const PickupModel = require('./../../models/pickup.model');
const orderModel = require('./../../models/order.model');
const API = require('./../../APILib');
const {order: orderStatus, pickup: pickupStatus} = require('../../constants/status');

module.exports = async (req, res) => {
  const data = req.body;

  try {
    //tìm chuyến đi có trạng thái là pending và thuộc về shiper cần tạo
    const pickupTrip = await PickupModel.findOne({status: pickupStatus.PENDING, user: data.user});

    if(pickupTrip){
      //Nếu đã tồn tại thì cập nhật lại chuyến đi đó
      const {data: pickupData} = pickupTrip;
      const updateData = JSON.parse(JSON.stringify(pickupTrip.data));
      
      let added = false;
      for(let i=0; i< pickupData.length; i++){
        const item = pickupData[i];
        const clientId = item.clientId.toString();
        if(clientId === data.client && !added){
          const orders = item.orders.concat(data.orders);
          updateData[i].orders = orders;
          added = true;
        }
      }
      if(!added){
        updateData.push({
          clientId: data.client,
          orders: data.orders
        });
      }
      
      const updateResult = await PickupModel.findByIdAndUpdate(pickupTrip._id, {data: updateData});
    }else{
      //Nếu chưa thì tạo mới chuyến đi
      const addData = {
        user: data.user,
        data: [{
          clientId: data.client,
          orders: data.orders
        }]
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