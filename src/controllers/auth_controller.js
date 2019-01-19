'use strict';

const authService = require('../services/auth_service')
    , authResponse = require('./auth_response')
    , shortcut = require('./response_shortcuts')
    , errors = require('../errors');

const authController = {

    login(req, res) {
        authService.login(req.query.email, req.query.password).then(authInfo => {
            shortcut.successResponse(res, authResponse.loginResponse(authInfo.user, authInfo.accessToken));
        }).catch (err => {
            if (err.errorType === errors.ErrorTypes.AUTH_PASSWORD_DONOT_MATCH ||
                err.errorType === errors.ErrorTypes.USER_NOT_FOUND) {
                res.status(400);
                shortcut.errorResponse(res, err);
            } else {
                shortcut.error500Response(res, err);
            }
        });
    },

    loggedIn(req, res) {
        authService.isLoggedIn(req.query.accessToken).then(isLoggedIn => {
            shortcut.successResponse(res, authResponse.loggedInResponse(isLoggedIn));
        }).catch(err => {
            shortcut.error500Response(res, err);
        });
    },

    createUnauthUser(req, res) {
        authService.createUnauthUser(req.body).then(() => {
            shortcut.successResponse(res);
        }).catch (err => {
            if (err.errorType === errors.ErrorTypes.USER_ALREADY_EXISTS ||
                err.errorType === errors.ErrorTypes.INVALID_PARAMETERS) {
                res.status(400);
                shortcut.errorResponse(res, err);
            } else {
                shortcut.error500Response(res, err);
            }
        });
    },
}

module.exports = authController;
