'use strict';

var model = require('./../../models/client.model');
var API = require('./../../APILib');
var utils = require('./../../utils');

module.exports = async (req, res) => {
    var authInfo = utils.getAuthInfo(req.headers.authorization);
    let clientId = '';
    if(!authInfo.role){
        clientId =  authInfo._id;
    }
  try {
    const result = await model
    .findById(clientId)
    .select(`
      id name username status email
      contactName district descriptionOfGoods 
      ward address phone password
      website bankNumber 
      bankAccount bankBranch 
      bankName updatedBank`
    )
    API.success(res, result);
  } catch (error) {
    API.fail(res, error);
  }
  
};