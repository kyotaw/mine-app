'use strict';

const db = require('../../infrastructures/sequelizedb');

const schema = {
    properties: {
        id: { type: db.Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
        userId: { type: db.Sequelize.STRING, allowNull: true, unique: true },
        socialUserId: { type: db.Sequelize.STRING, allowNull: true },
        password: { type: db.Sequelize.STRING, allowNull: true },
        email: { type: db.Sequelize.TEXT, isEmail: true, allowNull: true, unique: true },
        name: { type: db.Sequelize.STRING, allowNull: false, defaultValue: 'user' },
        salt: { type: db.Sequelize.TEXT, isEmail: true, allowNull: false},
        hashVersion: { type: db.Sequelize.INTEGER, allowNull: false},
        cryptVersion: { type: db.Sequelize.INTEGER, allowNull: false},
        loginSystem: { type: db.Sequelize.STRING, allowNull: false },
    }
}

const UserEntity = db.define('user', schema);

module.exports = {
    UserEntity: UserEntity,
    Schema: schema
}
