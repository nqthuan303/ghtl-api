var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var User = require('../models/user.model');
var Client = require('../models/client.model');  
var config = require('../config');
 
var opts = {};
opts.secretOrKey = config.secret;
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    var data = User;
    if(!jwt_payload.role){
        data = Client;
    }
    data.findOne({_id: jwt_payload._doc._id}).select('+password').exec(function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            if(jwt_payload._doc.password === user.password) {
                return done(null, user);
            }else{
                return done(null, false);
            }
        } else {
            done(null, false);
        }
    });
}));

exports.isAuthenticated = passport.authenticate('jwt', { session: false});
