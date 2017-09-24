'use strict';

var model = require('./../../models/pickup.model');
var API = require('./../../APILib');

module.exports = async (req, res) => {
    var objQuery = req.query;

    const pickUps = await model.find()
    .populate({
        path: 'client',
        select: 'name address phone district',
        populate: { 
            path: 'district',
            select: 'name type',
        }
    })
    .populate('user', 'name')
    .populate('orders', 'id')
    .sort({
        'createdAt': -1,
        'user': -1
    })

    let result = {}
    
    for(let i=0; i< pickUps.length; i++){
        const pickUp = pickUps[i];
        const shipper = pickUp.user;
        const client = pickUp.client;
        const clientDistrict = client.district;
        const orders = pickUp.orders;

        if(!result[shipper._id]) {
            result[shipper._id] = {
                shipperName: shipper.name,
                'pickUps': [
                    {
                        _id: pickUp._id,
                        id: pickUp.id,
                        createdAt: pickUp.createdAt,
                        client_id: client._id,
                        clientName: client.name, 
                        orders: orders,
                        numOfOrder: orders.length, 
                        clientPhone: client.phone, 
                        clientAddress: 
                            client.address + ', ' + 
                            clientDistrict.type + ' ' + 
                            clientDistrict.name
                    }
                ]
            };
        }else{
            result[shipper._id]['pickUps'].push({
                _id: pickUp._id,
                id: pickUp.id,
                createdAt: pickUp.createdAt,
                client_id: client._id,
                clientName: client.name, 
                orders: orders,
                numOfOrder: orders.length, 
                clientPhone: client.phone, 
                clientAddress: 
                    client.address + ', ' + 
                    clientDistrict.type + ' ' + 
                    clientDistrict.name
            })
        }
    }

    API.success(res, result);

};