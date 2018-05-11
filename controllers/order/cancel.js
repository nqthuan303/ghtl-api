const OrderModel = require('./../../models/order.model');
const PickupModel = require('./../../models/pickup.model');
const DeliveryModel = require('./../../models/delivery.model');
const ClientModel = require('./../../models/client.model');
const { order: orderStatus, pickup: pickupStatus, delivery: deliveryStatus } = require('../../constants/status');

module.exports = async (req, res) => {
    try {
        const data = req.body;
        const objOrder = await OrderModel.findById(data.orderId).lean();
        if(objOrder){
            const { orderstatus } = objOrder;
            let statusUpdate = orderStatus.CANCEL.value;
            if(orderstatus === orderStatus.PICKUP.value){
                const { client } = objOrder;
                const clientId = client.toString();
                const objFindOrdersInClient = {
                    client: clientId, 
                    orderstatus: orderStatus.PICKUP.value, 
                    _id: { $ne:  data.orderId }
                };
                const ordersInClient = await OrderModel.find(objFindOrdersInClient);
                if(ordersInClient.length === 0){
                    const objFindPickup = { clients: clientId, status: pickupStatus.INPROCESS };
                    const objPickup = await PickupModel.findOne(objFindPickup);
                    const pickupId = objPickup._id.toString();
                    const { clients } = objPickup;
                    const clientIds = [];
                    for(let i=0; i< clients.length; i++){
                        const clientInPickupId = clients[i].toString();
                        if(clientInPickupId !== clientId){
                            clientIds.push(clientInPickupId);
                        }
                    }
                    if(clientIds.length > 0){
                         await objPickup.update({clients: clientIds});
                    }else {
                        await objPickup.remove();
                    }
                }
            }
            if(orderstatus === orderStatus.STORAGE.value) {
                statusUpdate = orderStatus.RETURNSTORAGE.value;
            }
            if(orderstatus === orderStatus.DELIVERYPREPARE.value){
                statusUpdate = orderStatus.RETURNSTORAGE.value;
                const objFindDelivery = { status: deliveryStatus.PENDING, orders: data.orderId };
                const objDelivery = await DeliveryModel.findOne(objFindDelivery);
                if(objDelivery){
                    const { orders: deliveryOrders } = objDelivery;
                    const deliveryOrderIds = [];
                    for(let i=0; i< deliveryOrders.length; i++){
                        const deliveryOrderId = deliveryOrders[i].toString();
                        if(data.orderId !== deliveryOrderId){
                            deliveryOrderIds.push(deliveryOrderId);
                        }
                    }
                    if(deliveryOrderIds.length === 0){
                        await objDelivery.remove();
                    }else{
                        await objDelivery.update({orders: deliveryOrderIds});
                    }
                }
                
            }
            await OrderModel.findByIdAndUpdate(data.orderId, {orderstatus: statusUpdate});
        }
        API.success(res, {});
    } catch (error) {
        API.fail(res, error.message);
    }
    
    
}