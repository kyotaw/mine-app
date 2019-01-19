'use strict';

const passport = require('passport')
    , google = require('passport-google-oauth')
    , jwt = require('passport-jwt')
    , env = require('../env')
    , userService = require('../services/user_service')
    , errors = require('../errors');

const jwtOptions = {
    jwtFromRequest: jwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.auth.accessToken.JWT_SECRET,
    issure: env.auth.accessToken.JWT_ISSURE,
    audience: env.auth.accessToken.JWT_AUDIENCE
}

passport.use(new jwt.Strategy(jwtOptions, (payload, done) => {
    userService.getByUserId(payload.sub).then(user => {
        if (user) {
            done(null, user, payload);
        } else {
            done(null, null, null);
        }
    }).catch (err => {
        done(err);
    });
}));

function authenticateWithJwt() {
    return passport.authenticate(['jwt'], {session: false});
}

/*
passport.use(new google.OAuth2Strategy(
    {
        clientID: env.auth.google.CLIENT_ID,
        clientSecret: env.auth.google.CLIENT_SECRET,
        callbackURL: env.auth.google.CALLBACK_URL,
    },
    (request, accessToken, refreshToken, profile, done) => {
        userService.getBySocialId(profile.id, 'google').then(user => {
            if (user) {
                done(null, user);
            } else {
                user = userService.createSocialUser(profile.id, 'google').then(user => {
                    done(null, user);
                });
            }
        }).catch (err => {
            done(err);
        });
    }
));
*/

function authenticateByGoogle() {
    return passport.authenticate('google', {session: false, scope: ['openid', 'profile']});
}

function callbackFromGoogle() {
    return passport.authenticate('google', {session: false});
}

module.exports = {
    authenticateWithJwt: authenticateWithJwt,
    authenticateByGoogle: authenticateByGoogle,
    callbackFromGoogle: callbackFromGoogle,
    jwtOptions: jwtOptions,
}
