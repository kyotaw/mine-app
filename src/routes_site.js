'use strict';

const Router = require('express').Router
    , siteController = require('./controllers/site_controller')
    , errors = require('./errors')
    , shortcut = require('./controllers/response_shortcuts');

function routes() {
    const root = '/';
    let router = Router();
    
    router.get(root, siteController.home);

    // error
    router.use((err, req, res, next) => {
        res.status(err.status || 500);
        if (err instanceof errors.KairaiError) {
            shortcut.errorResponse(res, err);
        } else {
            next(err);
        }
    });

    return router;
}

module.exports = routes;
