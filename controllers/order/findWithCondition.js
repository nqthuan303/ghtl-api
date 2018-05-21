'use strict';

var model = require('./../../models/order.model');
const {order: orderStatus, paymentStatus, payment: paymentTable} = require('../../constants/status');
var API = require('./../../APILib');
var utils = require('./../../utils');

module.exports = async (req, res) => {
  const objQuery = req.query;
  let startDate = new Date(objQuery.startDate);
  let endDate = new Date(objQuery.endDate);
  const arrStatus = objQuery.status ? JSON.parse(objQuery.status) : [];
  var authInfo = utils.getAuthInfo(req.headers.authorization);
  let clientId = '';
  if(!authInfo.role){
    clientId =  authInfo._id;
  }
  let objSearch = {
    client: clientId,
    createdAt: { 
      $gte: startDate, 
      $lte: endDate
    } 
  }
  if(objQuery.address !== ''){
    objSearch['receiver.address'] = {$regex : '.*'+ objQuery.address+'.*'};
  }
  if(objQuery.nameOrPhone !== ''){
    objSearch.$or = [
      {'receiver.name': {$regex : '.*'+ objQuery.nameOrPhone+'.*', $options:"$i"}},
      {'receiver.phone': {$regex : '.*'+ objQuery.nameOrPhone+'.*', $options:"$i"}}
    ];
  }
  objSearch.orderstatus = {};
  if(arrStatus.length > 0 ){
    objSearch.orderstatus = {$in: arrStatus}
  }
  objSearch.orderstatus.$ne = orderStatus.TEMP.value;
  try {
    const result = await model.find(objSearch);
    API.success(res, result);
  } catch (error) {
    API.fail(res, error);
  }
};