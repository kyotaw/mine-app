'use strict';

const sequelize = require('./sequelizedb');

function start() {
    return new Promise((resolve, reject) => {
        sequelize.start().then(() => {
            resolve();
        }, (err) => {
            reject(err);
        });
    });
}

module.exports = {
    start: start
}
