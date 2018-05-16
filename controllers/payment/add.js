'use strict';

const model = require('./../../models/payment.model');
const orderModel = require('./../../models/order.model');
const ClientModel = require('./../../models/client.model');
const API = require('./../../APILib');
const utils = require('./../../utils');
const {paymentStatus} = require('../../constants/status');

module.exports = async (req, res) => {
  const data = req.body;
  const authInfo = utils.getAuthInfo(req.headers.authorization);
  data.createdBy = authInfo._id;
  data.startTime = new Date();
  const objData = new model(data);
  try {
    const objPayment = await objData.save({returnNewDocument : true});
    const objClient = await ClientModel.findById(data.client);
    if(objClient){
      const { payments } = objClient;
      const paymentsUpdate = [objPayment._id.toString()];
      if(payments){
        for(let i=0; i< payments.length; i++){
          const paymentId = payments[i].toString();
          if(paymentId !== objPayment._id.toString()){
            paymentsUpdate.push(paymentId);
          }
        }
      }
      
      await objClient.update({payments: paymentsUpdate});
    }
    
    const updateOrder = await orderModel.update(
      { _id : { $in : data.orders }}, 
      { paymentStatus: paymentStatus.UNPAID.value}, 
      {"multi": true}
    )

    API.success(res, objPayment);
  } catch (err) {
    return API.fail(res, err.message);
  }

};