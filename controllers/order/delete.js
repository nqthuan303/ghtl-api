'use strict';

var model = require('./../../models/order.model');
var clientModel = require('./../../models/client.model');
var orderLogModel = require('./../../models/orderLog.model');

var API = require('./../../APILib');

module.exports = async (req, res) => {
    var id = req.params.id;
    
    let order = await model.findById(id);

    const clientId = order.client.toString();

    let removeOrderOnClient = await clientModel.findOne({_id: clientId}).populate('orders').exec(function(err, dataFound) {
          let orders = [];
          for(let i=0; i< dataFound.orders.length; i++) {
            let orderId = dataFound.orders[i]._id.toString();
            if(orderId === id) {
              continue;
            }
            orders.push(orderId);
          }
          dataFound.update({'orders': orders}).exec();
    });
    
    let deleteDevice = await order.remove();

    const removeOrderLog = await orderLogModel.remove({order: id});

    API.success(res, {
        message: 'Xóa vận đơn thành công!',
        statusCode: 0
    });
};