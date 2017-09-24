'use strict';

var model = require('./../../models/user.model');
var modelRole = require('./../../models/role.model');
var API = require('./../../APILib');

module.exports = async (req, res) => {
    var objQuery = req.query;

    const roleShipper = await modelRole.findOne({name: 'Shipper'});
    const roleShipperId = roleShipper._id;

    model.aggregate([{ 
            "$project": {
                "_id": false,
                "key": "$_id",
                "value": "$_id",
                'role': true,
                "text": "$name"
            }
        },
        { $match : { role : roleShipperId } }
    ], function(err, data) {
        if (err) {
            res.send(err);
          }
          res.json(data);
    });

};