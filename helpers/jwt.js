'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'r2d2c3po';

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        nombres:user.nombres,
        email:user.email,
        role:user.rol,
        iat:moment().unix(),
        exp:moment().add(2,'days').unix()
    }
    return jwt.encode(payload,secret);
}