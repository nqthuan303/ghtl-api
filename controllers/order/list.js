    'use strict';

    const model = require('./../../models/order.model');
    const ClientModel = require('./../../models/client.model');
    const API = require('./../../APILib');
    const {order: orderStatus} = require('../../constants/status');

    module.exports = async (req, res) => {
      var objQuery = req.query;

      var recordsPerPage = Number(objQuery.recordsPerPage);
      var page = Number(objQuery.page);
      var skip = (page - 1) * recordsPerPage;
      var objSearch = await getObjSearch(objQuery);
      var objSort = {
        'createdAt': -1
      };

      if (objQuery.sortField && objQuery.sortValue) {
        objSort = {};
        objSort[objQuery.sortField] = objQuery.sortValue;
      }
      
      model.find(objSearch)
        .populate('client', 'name phone')
        .populate('createdBy', 'name')
        .populate('receiver.district', 'name type')
        .populate('receiver.ward', 'name type')
        .select('address payBy goodsMoney shipFee id receiver createdAt note client createdBy orderstatus')
        .limit(recordsPerPage)
        .skip(skip)
        .sort(objSort)
        .exec(function (err, data) {
          if (err) {
            return API.fail(res, err.message);
          }
          API.success(res, data);
        });
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

      if (objQuery.orderstatus && objQuery.orderstatus !== 'all') {
        arrAnd.push({
            'orderstatus': objQuery.orderstatus,
        });
      }


      if (arrAnd.length > 0) {
        query.$and = arrAnd;
      }
      return query;
    }