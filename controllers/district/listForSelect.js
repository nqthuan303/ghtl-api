'use strict';

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

var model = require('./../../models/district.model');
var API = require('./../../APILib');

module.exports = async((req, res) => {
    var objQuery = req.query;
    var provinceId = objQuery.provinceId;

    model.aggregate([{
            $match: {
                province_id: provinceId
            }
        },
        {
            "$project": {
                "_id": false, //KHông lấy _id ra 
                "value": "$_id",
                "label": {
                    $concat: ["$type", " ", "$name"] // nối cột
                }
            }
        }
    ], function (err, data) {
        if (err) {
            res.send(err);
        }
        res.json(data);
    });

});