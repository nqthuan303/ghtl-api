'use strict';

const model = require('./../../models/price.model');
const API = require('./../../APILib');
const utils = require('./../../utils');

module.exports = async (req, res) => {
  let data = req.body;
  const authInfo = utils.getAuthInfo(req.headers.authorization);
  data.createdBy = authInfo._id;
  const objData = new model(data);

  try {
    const addData = await objData.save();
    const data = await model.findOne({_id: addData._id}).populate('districts', 'name');

    const districts = data.districts;
    
    let strDistrict = '';
    let arrDistrict = [];
    for(let j=0; j< districts.length; j++){
      let district = districts[j];
      const districtId = district._id.toString();
      if(j === 0){
        strDistrict += district.name;
      }else{
        strDistrict += ', ' + district.name;
      }
      arrDistrict.push(districtId);
    }
    
    const returnData = {
      _id: data._id.toString(),
      area: data.area,
      price: data.price,
      strDistrict,
      districts: arrDistrict
    }

    API.success(res, returnData);

  } catch (err) { return API.fail(res, err.message); }

};