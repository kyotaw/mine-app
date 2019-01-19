'use strict';

const tradeService = require('../services/trade_service')
    , shortcut = require('./response_shortcuts')
    , tradeResponse = require('./trade_response');

const tradeController = {

    create(req, res) {
        tradeService.createTrade(req.body, req.user).then(trade => {
            shortcut.successResponse(res, trade.toDict()); 
        }, err => {
            shortcut.error500Response(res, err);
        });
    },
    
    get(req, res) {
        tradeService.getTrades(req.query, req.user).then(trades => {
            shortcut.successResponse(res, tradeResponse.tradesResponse(trades));
        }, err => {
            shortcut.error500Response(res, err);
        });
    }
}

module.exports = tradeController;
