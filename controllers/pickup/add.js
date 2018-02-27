'use strict';

const PickupModel = require('./../../models/pickup.model');
const orderModel = require('./../../models/order.model');
const orderStatusModel = require('./../../models/orderStatus.model');
const API = require('./../../APILib');
const status = require('../../constants/status');

module.exports = async (req, res) => {
  const data = req.body;

  try {
    //tìm chuyến đi có trạng thái là pending và thuộc về shiper cần tạo
    const pickupTrip = await PickupModel.findOne({status: status.pickup.PENDING, user: data.user});

    if(pickupTrip){
      //Nếu đã tồn tại thì cập nhật lại chuyến đi đó
      const {data: pickupData} = pickupTrip;
      const updateData = JSON.parse(JSON.stringify(pickupTrip.data));
      updateData.push({
        clientId: data.client,
        orders: data.orders
      });
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
    API.success(res, {});

  } catch (err) {
    API.fail(res, err.message);
  }

};