const PickupModel = require('./../../models/pickup.model');
const API = require('./../../APILib');
const { pickup: pickupStatus } = require('../../constants/status');

module.exports = async (req, res) => {
    try {
        const data = req.body;
        const { pickupId } = data;
        const result = await PickupModel.findByIdAndUpdate(pickupId, { status:  pickupStatus.DONE});
        API.success(res, {});
    } catch (error) {
        API.fail(res, error.message);
    }
};