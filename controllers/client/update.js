'use strict';

var model = require('./../../models/client.model');
var API = require('./../../APILib');

module.exports = async (req, res) => {
  var id = req.params.id;

  var data = req.body;

  try {
    const result = await model.findOneAndUpdate({_id: id}, data, {returnNewDocument : true});
    API.success(res, data);

  } catch (error) {
    API.fail(res, error);
  }
  
};