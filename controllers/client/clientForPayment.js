'use strict';

var model = require('./../../models/client.model');
var orderModel = require('./../../models/order.model');
const districtModel = require('./../../models/district.model');
var paymentModel = require('./../../models/payment.model');
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
    paymentStatus: {$in: [
        paymentStatus.PENDING.value,
        paymentStatus.UNPAID.value,
    ]}
};
module.exports = async (req, res) => {
    try {
        const clientData = await model.find().populate({
            path: 'orders',
            match:objSearch
        }).populate('district').lean();
        const result = [];
        for(let i =0; i< clientData.length; i++){
            const client = clientData[i];
            const orders = client.orders;
            if(orders.length === 0){
                continue;
            }
            const payment = await paymentModel.findOne({
                client: client._id,
                status : paymentTable.DOING}).lean();

            let totalMoney = 0;
            for(let k =0; k<orders.length; k++){
                const order = orders[k];
                let money = order.goodsMoney + order.shipFee;
                if (order.payBy === orderPayBy.SENDER.value) {
                    money = order.goodsMoney;
                }
                totalMoney += money;
            }
            result.push({
                ...client, 
                totalMoney,
                payment: payment ? {id: payment.id, _id: payment._id} : ''
            })
        }
        API.success(res, result)
    } catch (error) {
        return API.fail(res, error.message)
    }
};