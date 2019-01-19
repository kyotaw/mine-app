'use strict';

const error = require('../errors');

function convertQueryParams(socket, next) {
    let query = socket.handshake.query;
    if (query.latitude && query.longitude && query.radius) {
        query.area = {
            latitude: parseFloat(query.latitude),
            longitude: parseFloat(query.longitude),
            radius: parseFloat(query.radius)
        }
    } else {
        next(new error.KairaiError(error.ErrorTypes.INVALID_PARAMETERS));
    }
    query.method = query.method || 'average';
    return next();
}

module.exports = {
    convertQueryParams: convertQueryParams
}
