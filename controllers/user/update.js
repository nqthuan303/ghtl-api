'use strict';

var model = require('./../../models/user.model');
var API = require('./../../APILib');

module.exports = async (req, res) => {
  var id = req.params.id;
  var data = req.body;
  try {
    const result =  await model.findOneAndUpdate({ _id: id}, data);
    API.success(res, 'Cập nhật thành công');
  } catch (error) {
    API.fail(res, error.message);
  }
};