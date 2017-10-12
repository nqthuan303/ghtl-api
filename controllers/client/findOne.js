'use strict';

var model = require('./../../models/client.model');
var API = require('./../../APILib');

module.exports = async (req, res) => {
  var objParams = req.params;

  const result = await model
    .findById(objParams.id)
    .select(`
      id name userName status 
      contactName district 
      ward address phone 
      website bankNumber 
      bankAccount bankBranch 
      bankName isCod`
    );
  API.success(res, result);
};