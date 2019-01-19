'use strict';

const Trade = require('./trade').Trade

const tradeFactory = {

    async createFromDict(params) {
        return new Trade(params);
    },

    async createFromEntity(entity) {
        return new Trade(entity);
    }
}

module.exports = tradeFactory;
