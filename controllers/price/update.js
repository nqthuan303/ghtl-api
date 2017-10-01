'use strict';

const model = require('./../../models/price.model');
const API = require('./../../APILib');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

module.exports = async (req, res) => {
  const objParams = req.params;
  const postData = req.body;

  try {
    model.up
    const updateData = await model.findByIdAndUpdate(objParams.id, postData);
    const data = await model.findOne({_id: objParams.id}).populate('districts', 'name');
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