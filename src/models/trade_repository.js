'use strict';

const tradeFactory = require('./trade_factory')
    , TradeEntity = require('./entities/trade_entity').TradeEntity;

const tradeRepository = {

    async create(params) {
        const trade = await tradeFactory.createFromDict(params);
        const entity = await TradeEntity.create(trade.toDict());
        trade.id = entity.id;
        return trade;
    },

    async getByUserId(userId) {
        const entities = await TradeEntity.findAll({where: {userId: userId}});
        let trades = [];
        for (e of entities) {
            trades.push(await tradeFactory.createFromEntity(e));
        }
        return trades;
    }
}

module.exports = tradeRepository;
