'use strict';

var model = require('./../../models/client.model');
const PriceDefaultModel = require('./../../models/priceDefault.model');
const PriceModel = require('./../../models/price.model');
var API = require('./../../APILib');
var utils = require('./../../utils');

module.exports = async (req, res) => {
  var data = req.body;
  var authInfo = utils.getAuthInfo(req.headers.authorization);
  data.createdBy = authInfo._id;
  var objData = new model(data);

  try {
    const result = await objData.save();

    const priceDefaults = await PriceDefaultModel.find().lean();
    for(let i=0; i< priceDefaults.length; i++){
      const priceDefault = priceDefaults[i];
      const priceData = {
        client: result._id,
        area: priceDefault.area,
        price: priceDefault.price,
        createdBy: authInfo._id,
        districts: priceDefault.districts
      };
      const objPriceData = new PriceModel(priceData);
      const resultAddPrice = await objPriceData.save();
    }
    
    API.success(res, result);
  } catch (error) {
    API.fail(res, error.message);
  }
};