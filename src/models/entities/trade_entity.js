'use strict';

const db = require('../../infrastructures/sequelizedb')
    , UserEntity = require('./user_entity').UserEntity;

const schema = {
    properties: {
        id: { type: db.Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
        currencyPair: { type: db.Sequelize.STRING, allowNull: false },
        exchange: { type: db.Sequelize.STRING, allowNull: false },
        traderId: { type: db.Sequelize.INTEGER, allowNull: false },
    }
}

const TradeEntity = db.define('trade', schema);
TradeEntity.belongsTo(UserEntity);

module.exports = {
    TradeEntity: TradeEntity,
    Schema: schema
}
