'use strict';

var model = require('./../../models/delivery.model');
var API = require('./../../APILib');
const orderModel = require('./../../models/order.model');
const {delivery: deliveryStatus} = require('../../constants/status');

module.exports = async (req, res) => {
  var id = req.params.id;
  var postData = req.body;
  const orders = postData.orders;
  try {
    const endTime = new Date();
    const result = await model.findOneAndUpdate({_id: id}, {
      status: deliveryStatus.COMPLETED,
      collectedMoney: postData.collectedMoney,
      endTime,
    }, {returnNewDocument : true});
    
    for(let status in orders){
        const updateOrder = await orderModel.update(
            { _id : { $in : orders[status] }}, 
            { orderstatus: status}, 
            {"multi": true}
          )
    }
    API.success(res, "Kết thúc chuyến giao hàng thành công!!!");
  } catch (error) {
    API.fail(res, error.message);
  }
  
};