'use strict';

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

var model = require('./../../models/user.model');
var API = require('./../../APILib');

module.exports = async((req, res) => {
    model.aggregate([{
        "$project": {
            "_id": false,
            "value": "$_id",
            "label": "$name",
        }
    }], function (err, data) {
        if (err) {
            res.send(err);
        }
        res.json(data);
    });
});