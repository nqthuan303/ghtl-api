'use strict';

var model = require('./../../models/delivery.model');
const orderModel = require('./../../models/order.model');
const orderStatusModel = require('./../../models/orderStatus.model');
const status = require('../../constants/orderStatus')
var API = require('./../../APILib');

module.exports = async (req, res) => {
  var id = req.params.id;
  var postData = req.body;

  try {
    const endTime = new Date();
    const result = await model.findOneAndUpdate({_id: id}, {status: 'completed', endTime}, {returnNewDocument : true});
    
    for(let status in postData){
        const updateOrder = await orderModel.update(
            { _id : { $in : postData[status] }}, 
            { orderstatus: status}, 
            {"multi": true}
          )
    }
    API.success(res, "Kết thúc chuyến giao hàng thành công!!!");
  } catch (error) {
    API.fail(res, error.message);
  }
  
};