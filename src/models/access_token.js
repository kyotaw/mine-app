'use strict';

const jwt = require('jsonwebtoken')
    , env = require('../env');

class AccessToken {
    
    constructor(user) {
        this.token = jwt.sign({},
            env.auth.accessToken.JWT_SECRET,
            {
                expiresIn: env.auth.accessToken.JWT_EXPIRES_IN,
                audience: env.auth.accessToken.JWT_AUDIENCE,
                issuer: env.auth.accessToken.JWT_ISSURE,
                subject: user.userId.toString(),
            }
        );
    }

    toDict() {
        return {
            accessToken: this.token
        }
    }
}

module.exports.AccessToken = AccessToken;
