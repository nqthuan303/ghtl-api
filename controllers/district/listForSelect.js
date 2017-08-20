'use strict';
var model = require('./../../models/district.model');
var API = require('./../../APILib');

module.exports = (req, res) => {
    var objQuery = req.query;
    var provinceId = objQuery.provinceId;

    model.aggregate([{
            $match: {
                province: '587124bcbe644a04d4b14e8b'
            }
        },
        {
            "$project": {
                "_id": false,
                "key": "$_id",
                "value": "$_id",
                "text": {
                    $concat: ["$type", " ", "$name"]
                }
            }
        }
    ], function (err, data) {
        if (err) {
            res.send(err);
        }
        res.json(data);
    });

};