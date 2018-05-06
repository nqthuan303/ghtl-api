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
        for(const key in objChecked) {
            const item = objChecked[key];
            for(const orderId in item){
                const checked = item[orderId];
                if(checked){
                    orderStorageIds.push(orderId);
                }else{
                    orderPendingIds.push(orderId);
                }
            }
        }
        await OrderModel.updateMany({_id: {$in: orderStorageIds}}, {orderstatus: orderStatus.STORAGE.value});
        await OrderModel.updateMany({_id: {$in: orderPendingIds}}, {orderstatus: orderStatus.PENDING.value});

        const result = await PickupModel.findByIdAndUpdate(pickupId, { status:  pickupStatus.DONE});
        API.success(res, {});
    } catch (error) {
        API.fail(res, error.message);
    }
};