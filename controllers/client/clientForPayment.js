'use strict';

var model = require('./../../models/client.model');
var orderModel = require('./../../models/order.model');
const districtModel = require('./../../models/district.model');
var API = require('./../../APILib');
const {order: orderStatus, paymentStatus, orderPayBy, payment: paymentTable} = require('../../constants/status');
const objSearch = {
    orderstatus: {$in: [
        orderStatus.DELIVERED.value,
        orderStatus.RETURNFEESTORAGE.value,
        orderStatus.RETURNFEEPREPARE.value,
        orderStatus.RETURNINGFEE.value,
        orderStatus.RETURNEDFEE.value,
        orderStatus.RETURNSTORAGE.value,
        orderStatus.RETURNPREPARE.value,
        orderStatus.RETURNING.value,
        orderStatus.RETURNED.value,
    ]},
    paymentStatus: {$ne: paymentStatus.PAID.value}
};
module.exports = async (req, res) => {
    try {
        const clientData = await model.find().populate({
            path: 'orders',
            match:objSearch
        }).populate('district')
        .populate({
            path: 'payments',
            match: {status: paymentTable.DOING},
            select: '_id id',
        }).lean();

        const result = [];
        for(let i =0; i< clientData.length; i++){
            const client = clientData[i];
            const orders = client.orders;
            if(orders.length === 0){
                continue;
            }

            let totalMoney = 0;
            for(let k =0; k<orders.length; k++){
                const order = orders[k];
                const { orderstatus, shipFee, goodsMoney, payBy } = order;
                let moneyFromReceiver = 0;
                if (orderstatus === orderStatus.DELIVERED.value) {
                    moneyFromReceiver = goodsMoney;
                    if (payBy === orderPayBy.RECEIVER.value) {
                        moneyFromReceiver += shipFee;
                    }
                }
                let realShipfee = 0;
                if (
                    orderstatus === orderStatus.DELIVERED.value ||
                    orderstatus === orderStatus.RETURNFEESTORAGE.value ||
                    orderstatus === orderStatus.RETURNEDFEE.value ||
                    orderstatus === orderStatus.RETURNFEEPREPARE.value
                ) {
                    realShipfee = shipFee;
                }
                totalMoney += (moneyFromReceiver - realShipfee);
            }
            result.push({
                ...client, 
                totalMoney
            })
        }
        API.success(res, result)
    } catch (error) {
        return API.fail(res, error.message)
    }
};