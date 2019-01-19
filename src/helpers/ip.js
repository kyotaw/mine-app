'use strict';

const rest = require('restler');

function getIp() {
    return new Promise((resolve, reject) => {
        rest.get('http://ifconfig.io/ip', { timeout: 10000 })
            .on('success', (data, res) => {
                resolve(data);
            })
            .on('error', (err, res) => {
                resolve('unknown');
            })
            .on('timeout', (err, res) => {
                resolve('unknown');
            });
    });
}

module.exports = getIp;
