'use strict';

const AccessToken = require('../models/access_token').AccessToken
    , unauthUserRepository = require('../models/unauth_user_repository')
    , userRepository = require('../models/user_repository')
    , UnauthUser = require('../models/unauth_user').UnauthUser
    , errors = require('../errors')
    , hashEnv = require('../env').auth.hash
    , cryptEnv = require('../env').auth.crypt
    , hash = require('../helpers/hash')
    , encrypt = require('../helpers/crypt').encrypt
    , jwtOptions = require('../middlewares/auth_filter').jwtOptions
    , jwt = require('passport-jwt');

const authService = {

    async login(email, password) {
        const encryptedEmail = encrypt(email, cryptEnv.latestVersion.AUTH_CRYPT_KEY, cryptEnv.latestVersion.AUTH_CRYPT_ALGO);
        const user = await userRepository.getByEmail(encryptedEmail);
        if (!user) {
            throw new errors.KairaiError(errors.ErrorTypes.USER_NOT_FOUND);
        }

        const passMatch = await user.comparePassword(password);
        if (!passMatch) {
            throw new errors.KairaiError(errors.ErrorTypes.PASSWORD_DONOT_MATCH);
        }
        return {user: user, accessToken: this.generateAccessToken(user)};
    },

    async isLoggedIn(accessToken) {
        return new Promise((resolve, reject) => {
            jwt.Strategy.JwtVerifier(
                accessToken,
                jwtOptions.secretOrKey,
                jwtOptions,
                (err, payload) => {
                    if (err) {
                        resolve(false);
                    } else {
                        userRepository.getByUserId(payload.sub).then(user => {
                            const isLoggedIn = user ? true : false;
                            resolve(isLoggedIn);
                        },
                        reject);
                    }
                });
        });
    },

    async createUnauthUser(params) {
        if (!params.email || !params.password) {
            throw new errors.KairaiError(errors.ErrorTypes.INVALID_PARAMETERS);
        }

        params.userId = hash.randomBytes(64);
        params.loginSystem = 'kairai';
        const newUser = new UnauthUser(params);
        await newUser.setPassword(params.password);
        await newUser.setEmail(params.email);
        
        if (await userRepository.getByEmail(newUser.email) || await unauthUserRepository.getByEmail(newUser.email)) {
            throw new errors.KairaiError(errors.ErrorTypes.USER_ALREADY_EXISTS);
        }

        await unauthUserRepository.create(newUser);
        await newUser.sendCertifiationEmail();
    },
    
    generateAccessToken(user) {
        return new AccessToken(user);
    }
}

module.exports = authService;
