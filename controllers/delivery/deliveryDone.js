'use strict';

var model = require('./../../models/delivery.model');
var API = require('./../../APILib');
const {delivery: deliveryStatus} = require('../../constants/status');

module.exports = async (req, res) => {
  var id = req.params.id;
  try {
    const endTime = new Date();
    const result = await model.findOneAndUpdate({_id: id}, {
      status: deliveryStatus.DONE,
      endTime,
    }, {returnNewDocument : true});
    
    API.success(res, "Chuyến đi giao đã được thu tiền!!!");
  } catch (error) {
    API.fail(res, error.message);
  }
  
};