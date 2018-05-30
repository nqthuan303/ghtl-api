'use strict';

var model = require('./../../models/client.model');
var API = require('./../../APILib');
var utils = require('./../../utils');
var bcrypt = require('bcryptjs'), SALT_WORK_FACTOR = 10;

module.exports = (req, res) => {
    var authInfo = utils.getAuthInfo(req.headers.authorization);
    let clientId = '';
    if(!authInfo.role){
        clientId =  authInfo._id;
    }else{
        API.fail(res, 'Bạn cần đăng nhập lại!')
    }
    let reqBody = req.body;
    let newPassword = reqBody.newPassword, password = reqBody.password;

    model.findOne({_id: clientId}).select('+password').exec(function(err, data){
        if(!data) return API.fail(res, API.errors.USER_NOT_FOUND);

        data.comparePassword(password, (error, isMatch) => {
            if (error) {
                return API.fail(res, API.errors.UNKNOWN);
            }

            if (!isMatch) {
                return API.fail(res, API.errors.USER_PASSWORD_NOT_MATCH);
            }
            bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
                if (err) return API.fail(res, err.message);
                bcrypt.hash(newPassword, salt, function(err, hash) {
                        if (err) return API.fail(res, err.message);
                        model.findOneAndUpdate({
                            _id: clientId
                          }, {password: hash}, function (err, doc) {
                            if (err) {
                                return API.fail(res, err.message);
                            }
                            API.success(res, 'Thay đổi mật khẩu thành công');
                        });
                    }
                );
            });            
        });
    });
};