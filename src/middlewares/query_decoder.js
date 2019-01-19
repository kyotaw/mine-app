'use strict';

function decodeQuery(req, res, next) {
    if (req.query) {
        let decoded = {};
        for (let key in req.query) {
            decoded[decodeURIComponent(key)] = decodeURIComponent(req.query[key]);
        }
        req.query = decoded;
    }
    next();
}

module.exports = {
    decodeQuery: decodeQuery
}
