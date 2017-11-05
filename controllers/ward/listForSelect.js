'use strict';

var model = require('./../../models/ward.model');
var API = require('./../../APILib');

module.exports = async (req, res) => {
  var objQuery = req.query;
  var districtId = objQuery.districtId;

  const project = {
    "_id": false,
    "key": "$_id",
    "value": "$_id",
    "text": {
      $concat: ["$type", " ", "$name"]
    }
  };

  const match = { district: districtId };

  try {
    const result = await model.aggregate([
      { $match: match },
      { $project: project }
    ]);
    API.success(res, result);

  } catch (error) {
    return API.fail(res, error.message);
  }
};