'use strict';

const tradeRepository = require('../models/trade_repository');

const tradeService = {

    async createTrade(params, user) {
        params.userId = user.id;
        return tradeRepository.create(params);
    },

    async getTrades(query, user) {
        return await tradeRepository.getByUserId(user.id);
    }

}
