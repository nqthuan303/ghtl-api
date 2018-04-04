'use strict';

var model = require('./../../models/delivery.model');
var API = require('./../../APILib');
const orderModel = require('./../../models/order.model');
const historyModel = require('./../../models/history.model');
const {delivery: deliveryStatus} = require('../../constants/status');

module.exports = async (req, res) => {
  var id = req.params.id;
  var postData = req.body;
  const orders = postData.orders;
  try {
    const endTime = new Date();
    const result = await model.findOneAndUpdate({_id: id}, {
      status: deliveryStatus.COMPLETED,
      money: postData.money,
      endTime,
    }, {returnNewDocument : true});
    
    for(let status in orders){
        let arrOrder = orders[status];
        const updateOrder = await orderModel.update(
            { _id : { $in : arrOrder }}, 
            { orderstatus: status}, 
            {"multi": true}
          )

        for(let i=0; i< arrOrder.length; i++){
          const objData = new historyModel({
            type: 'delivery',
            typeId: id,
            orderId: arrOrder[i],
            orderStatus: status,
          });
          const result = await objData.save();
        }
    }
    API.success(res, "Kết thúc chuyến giao hàng thành công!!!");
  } catch (error) {
    API.fail(res, error.message);
  }
  
};