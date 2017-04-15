'use strict';
let fetch = require('node-fetch');
var API = {};
API.res = null;

const STATUS_FAIL = 'fail';
const STATUS_SUCCESS = 'success';

var errors = {
    UNKNOWN: {
        code: 1,
        text: 'Unknown error'
    },
    USER_EXIST: {
        code: 100,
        text: 'User exist'
    },

    MISSED_FIELD: {
        code: 101,
        text: 'Some fields missing'
    },

    USER_PASSWORD_NOT_MATCH: {
        code: 103,
        // text: 'User password not match',
        text: 'Mật khẩu không đúng',
    },

    USER_CODE_NOT_MATCH: {
        code: 103,
        text: 'Code not match'
    },

    INVALID_EMAIL_ADDRESS: {
        code: 400,
        text: 'Invalid E-mail address'
    },
    INVALID_NAME: {
        code: 400,
        text: 'Invalid username'
    },

    INVALID_PHONE_NUMBER: {
        code: 400,
        text: 'Invalid phone number'
    },

    UNAUTHORIZED: {
        code: 401,
        text: 'Unauthorized'
    },

    ACCESS_DENIED: {
        code: 403,
        text: 'Access denied'
    },

    NOT_FOUND: {
        code: 404,
        text: 'Not found'
    },

    USER_NOT_FOUND: {
        code: 404,
        // text: 'User not found',
        text: 'Không tìm thấy User'
    },

    DATE_EXPIRED: {
        code: 409,
        text: 'Expiry date is ended'
    }

};

API.errors = errors;

API.responce = function (status, code, data) {

    if (typeof code == 'undefined' && typeof data == 'undefined') {
        data = status;
        code = 0;
        status = STATUS_SUCCESS;
    }

    status = typeof status == 'undefined' ? STATUS_SUCCESS : status;
    code = typeof code == 'undefined' ? 0 : code;
    data = typeof data == 'undefined' ? {} : data;

    return {
        status: status,
        code: code,
        data: data
    };
};

API.response = API.responce;

API.success = (res, data) => {
    if (!res && !API.res) throw new Error('You should pass an response object as first parameter because it does not set in your router');
    if (!data) {
        data = res;
        res = API.res;
    }
    if (!res || !res.json) throw new Error('Response should be a valid express response object');
    return res.json(API.response(data));
};

API.fail = (res, error) => {
    if (!res && !API.res) throw new Error('You should pass an response object as first parameter because it does not set in your router');
    if (!error) {
        error = res;
        res = API.res;
    }
    if (!res || !res.json) throw new Error('Response should be a valid express response object');
    return res.json(API.error(error));
};

API.error = function (errorMsg, errorCode) {
    errorMsg = typeof errorMsg == 'undefined' ? '' : errorMsg;
    errorCode = typeof errorCode == 'undefined' ? 0 : errorCode;

    if (typeof errorMsg == 'object') {
        errorCode = errorMsg.code;
        errorMsg = errorMsg.text;
    }

    return API.responce(STATUS_FAIL, errorCode, {
        msg: errorMsg
    });
};

API.get = url => {
    return fetch(url)
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return Promise.resolve(response)
            } else {
                return Promise.reject(new Error(response.statusText))
            }
        })
        .then(response => response.json());
};

API.post = (url, data) => {
    let _body = '';
    if (typeof data == 'object') {
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                let value = data[key];
                if (typeof value == 'object') {
                    value = JSON.stringify(value);
                }
                _body += (_body.length ? '&' : '') + key + '=' + value;
            }
        }
    } else {
        _body = data;
    }
    return fetch(url, {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: _body
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return Promise.resolve(response)
            } else {
                return Promise.reject(new Error(response.statusText))
            }
        })
        .then(response => response.json());
};

module.exports = API;