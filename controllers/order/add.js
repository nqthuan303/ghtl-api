'use strict';

const model = require('./../../models/order.model');
const clientModel = require('./../../models/client.model');
const API = require('./../../APILib');
const utils = require('./../../utils');

module.exports = async (req, res) => {
  const data = req.body;
  const authInfo = utils.getAuthInfo(req.headers.authorization);
  data.createdBy = authInfo._id;
  const objData = new model(data);

  try {
    const saveOrder = await objData.save();
    let clientFound = await clientModel.findOne({_id: data.client});
    
    let clientOrder = [];
    if(clientFound.orders && clientFound.orders.length > 0) {
      clientOrder = clientFound.orders;
    }
  
    clientOrder.push(saveOrder._id);
  
    const saveClient = await clientModel.findOneAndUpdate({_id: data.client}, {orders: clientOrder});
  
    API.success(res, {
        message: 'Success!'
    });
  } catch (err) {
    return API.fail(res, err.message);
  }

};