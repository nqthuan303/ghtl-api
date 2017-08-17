'use strict';

let async = require('asyncawait/async'),
    await = require('asyncawait/await');
    
var model = require('./../../models/post.model');
var API = require('./../../APILib');

module.exports = async((req, res) => {
    model.count(function(err, data) {
        if (err) {
        res.send(err);
        }
        res.json(data);
    });
});