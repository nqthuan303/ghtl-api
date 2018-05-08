const PickupModel = require('./../../models/pickup.model');
const OrderModel = require('./../../models/order.model');
const API = require('./../../APILib');
const { pickup: pickupStatus, order: orderStatus } = require('../../constants/status');

module.exports = async (req, res) => {
    try {
        const data = req.body;
        const { pickupId, objChecked } = data;
        const orderStorageIds = [];
        const orderPendingIds = [];
        const { STORAGE, PENDING } = orderStatus;
        const clientsToBeKeeped = [];
        for(const key in objChecked) {
            const item = objChecked[key];
            let count = 0;
            for(const orderId in item){
                const checked = item[orderId];
                if(checked){
                    orderStorageIds.push(orderId);
                    count++;
                }else{
                    orderPendingIds.push(orderId);
                }
            }
            if(count > 0){
                clientsToBeKeeped.push(key);
            }
        }
        const objUpdate = { status:  pickupStatus.DONE };
        if(orderStorageIds.length > 0) {
            objUpdate.orders = orderStorageIds;
            await OrderModel.updateMany({_id: {$in: orderStorageIds}}, {orderstatus: STORAGE.value});
        }
        if(orderPendingIds.length > 0){
            await OrderModel.updateMany({_id: {$in: orderPendingIds}}, {orderstatus: PENDING.value});
        }
        if(clientsToBeKeeped.length > 0){
            objUpdate.clients = clientsToBeKeeped;
        }
        const result = await PickupModel.findByIdAndUpdate(pickupId, objUpdate);
        API.success(res, {});
    } catch (error) {
        API.fail(res, error.message);
    }
};