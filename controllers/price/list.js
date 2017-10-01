'use strict';
var model = require('./../../models/price.model');
var API = require('./../../APILib');

module.exports = async (req, res) => {
  try {
    const objParams = req.params;

    const data = await model
      .find({client: objParams.shopId})
      .populate('districts', 'name')
      .sort({_id: -1});

    let result = [];

    for(let i=0; i< data.length; i++){
      const item = data[i];
      const districts = item.districts;
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
      result.push({
        _id: item._id.toString(),
        area: item.area,
        price: item.price,
        strDistrict,
        districts: arrDistrict
      });
    }
      
    API.success(res, result);

  } catch (err) { return API.fail(res, err.message); }
    
};