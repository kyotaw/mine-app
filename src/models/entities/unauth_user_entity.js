'use strict';

const db = require('../../infrastructures/sequelizedb')
    , userSchema = require('./user_entity').Schema;

const schema = {
    properties: {
        expiresIn: { type: db.Sequelize.BIGINT, allowNull: false},
        certCode: { type: db.Sequelize.STRING, allowNull: false },
    }
}

const UnauthUserEntity = db.define('unauth_user', schema, userSchema);

module.exports = {
    UnauthUserEntity: UnauthUserEntity,
    schema: schema
}
