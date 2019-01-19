'use strict';

function tradesResponse(trades) {
    let data = [];
    for (let t of trades) {
        data.push(t.toDict());
    }
    return data;
}

module.exports = {
    tradesResponse: tradesResponse
}
