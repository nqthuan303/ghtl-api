'use strict';
let config = require('./config'),
    jwt = require('jsonwebtoken');

const utils = {
    getAuthInfo: (authString) => {
        var parted = authString.split(' ');
        var token = parted[1];
        var decoded = jwt.decode(token, config.secret);

        return decoded._doc;
    }
};

module.exports = utils;