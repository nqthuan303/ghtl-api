    'use strict';

    const OrderModel = require('./../../models/order.model');
    const ClientModel = require('./../../models/client.model');
    const { Types: {ObjectId} } = require('mongoose');
    var API = require('./../../APILib');
    const { order: orderStatus } = require('../../constants/status');

    module.exports = async (req, res) => {
        var objQuery = req.query;
        try {
            const objSearch = await getObjSearch(objQuery);
            const aggregateOpt = [
                { $match: objSearch },
                {
                    $group: {
                        _id: "$orderstatus",
                        count: { $sum: 1 }
                    }
                }
            ]
            let ordersInStatus = await OrderModel.aggregate(aggregateOpt);

            let statusId = [];

            const objCount = {}

            for(let i=0; i< ordersInStatus.length; i++) {
                const item = ordersInStatus[i];
                objCount[item._id] = item.count;
                statusId.push(item._id);
            }

            const result = [];
            for(const key in orderStatus) {
                const item = orderStatus[key];
                if(objCount[item.value]){
                    result.push({
                        value: item.value,
                        name: item.name,
                        count: objCount[item.value]
                    });
                }
            }
            API.success(res, result);
        } catch (error) {
            API.fail(res, error.message);
        }
        
    };

    async function getObjSearch(objQuery) {
        var query = {};
  
        var arrAnd = [];
  
        if(objQuery.senderNameOrPhone){
          const searchClient = {
            $or: [
              {'name': new RegExp(".*" + objQuery.senderNameOrPhone.replace(/(\W)/g, "\\$1") + ".*", "i")},
              {'phone': new RegExp(".*" + objQuery.senderNameOrPhone.replace(/(\W)/g, "\\$1") + ".*", "i")}
            ]
          };
          const clients = await ClientModel.find(searchClient).select('_id').lean();
          const clientIds = [];
          if(clients.length > 0){
            for(let i=0; i< clients.length; i++){
              const client = clients[i];
              const clientId = client._id.toString();
              clientIds.push(clientId);
            }
          }
          arrAnd.push({
            'client': {$in: clientIds}
          });
          
        }
  
        if (objQuery.orderId) {
          arrAnd.push({
              'id': new RegExp(".*" + objQuery.orderId.replace(/(\W)/g, "\\$1") + ".*", "i"),
          });
        }
  
        if (objQuery.receiverNameOrPhone) {
          arrAnd.push({
            '$or': [{
                'receiver.name': new RegExp(".*" + objQuery.receiverNameOrPhone.replace(/(\W)/g, "\\$1") + ".*", "i")
              },
              {
                'receiver.phone': new RegExp(".*" + objQuery.receiverNameOrPhone.replace(/(\W)/g, "\\$1") + ".*", "i")
              }
            ]
          });
        }
  
        if(objQuery.createdDate){
          const arrDate = objQuery.createdDate.split(',');
          const startDate = new Date(arrDate[0]);
          startDate.setHours(0);
          startDate.setMinutes(0);
          startDate.setSeconds(1);
          const endDate = new Date(arrDate[1]);
          endDate.setHours(23);
          endDate.setMinutes(59);
          endDate.setSeconds(59);
          arrAnd.push({ createdAt: { $gte: startDate, $lte: endDate } });
        }
  
  
        if (arrAnd.length > 0) {
          query.$and = arrAnd;
        }
        return query;
      }