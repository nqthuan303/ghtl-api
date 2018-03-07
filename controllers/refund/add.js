'use strict';

const model = require('./../../models/refund.model');
const orderModel = require('./../../models/order.model');
const API = require('./../../APILib');
const utils = require('./../../utils');

module.exports = async (req, res) => {
  const data = req.body;
  const authInfo = utils.getAuthInfo(req.headers.authorization);
  try {
    // const orderStatus = await orderStatusModel.find({
    //   'value' : [
    //     status.order.PREPARE_REFUND_RETURNING,
    //     status.order.PREPARE_CANCEL_RETURNING, 
    //     status.order.REFUND_STORAGE,
    //     status.order.CANCEL_RETURNING
    // ]
    // }).lean();
    // let refundStorageId = '';
    // let prepareRefundReturn = '';
    // let refundStorageId = '';
    // let refundStorageId = '';
    // for(let i=0; i< orderStatus.length; i++){
    //   const tmpStatus = orderStatus[i];
    //   if(tmpStatus.value === status.order.PREPARE_REFUND_RETURNING){

    //   }
    // }
    // const objData = new model(data);
    // const saveOrder = await objData.save();
    
    // const prepareDeliveryId = prepareDelivery._id;

    // const updateOrder = await orderModel.update(
    //   { _id : { $in : data.orders }}, 
    //   { orderstatus: prepareDeliveryId},
    //   {"multi": true}
    // )

    API.success(res, {
        message: 'Success!'
    });
  } catch (err) {
    return API.fail(res, err.message);
  }

};