'use strict';

var model = require('./../../models/delivery.model');
const orderModel = require('./../../models/order.model');
const orderStatusModel = require('./../../models/orderStatus.model');
const status = require('../../constants/status')
var API = require('./../../APILib');

module.exports = async (req, res) => {
  var id = req.params.id;
  var data = req.body;

  try {
    const result = await model.findOneAndUpdate({_id: id}, data, {returnNewDocument : true});
    
    const prepareDelivery = await orderStatusModel.findOne({value: status.order.PREPAREDELIVERY});
    const prepareDeliveryId = prepareDelivery._id;
    const updateOrder = await orderModel.update(
      { _id : { $in : data.orders }}, 
      { orderstatus: prepareDeliveryId}, 
      {"multi": true}
    )
    API.success(res, data);
  } catch (error) {
    API.fail(res, error);
  }
  
};