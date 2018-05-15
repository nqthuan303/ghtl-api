'use strict';

var model = require('./../../models/client.model');
const {order: orderStatus, paymentStatus, payment: paymentTable} = require('../../constants/status');
var API = require('./../../APILib');
var utils = require('./../../utils');

module.exports = async (req, res) => {
  const data = req.body;
  var authInfo = utils.getAuthInfo(req.headers.authorization);
  const clientId = '';
  if(!authInfo.role){
    clientId =  authInfo._id;
  }
  try {
    const result = await model.find({
       client: clientId,
       createdAt: { $gte: data.startDate, $lte: data.endDate},
      //  'receiver.address': data.address,
      //  $or: [{'receiver.name': {$regex : '/.*'+ data.nameOrPhone+'.*/'}}, {'receiver.phone': {$regex : '/.*'+ data.nameOrPhone+'.*/'}}]
    })
    API.success(res, result);
  } catch (error) {
    API.fail(res, error);
  }
};