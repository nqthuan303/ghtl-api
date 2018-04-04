'use strict';

var model = require('./../../models/delivery.model');
var API = require('./../../APILib');

module.exports = (req, res) => {
    // await model.update({}, {orderstatus: 'storage'}, {'multi': true})
    model.find()
        .populate('user', 'name phone_number id')
        .populate({
            path: 'orders',
            populate:{
                path: 'receiver.district',
                select: '_id type name'
            }
        })
        .exec(function (err, data) {
            if (err) {
                API.fail(res, err.message)
            }
            API.success(res, data);
        });
};
