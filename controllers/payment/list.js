'use strict';

var model = require('./../../models/payment.model');
var API = require('./../../APILib');
const {payment} = require('../../constants/status');
module.exports = async (req, res) => {
    try {
        const data = await model.find({'status': payment.DONE}).populate('client')
        API.success(res, data);
    } catch (error) {
        API.fail(res, err.message)
    }
};
