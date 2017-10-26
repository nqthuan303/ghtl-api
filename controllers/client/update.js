'use strict';

var model = require('./../../models/client.model');
var API = require('./../../APILib');

module.exports = async (req, res) => {
  var id = req.params.id;

  var data = req.body;
  delete data._id;

  try {
    const result = await model.findOneAndUpdate({_id: id}, data);
    API.success(res, {});

  } catch (error) {
    API.fail(res, error);
  }
  
};