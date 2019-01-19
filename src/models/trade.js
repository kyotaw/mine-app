'use strict';

class Trade {

    constructor(params) {
        this.id = params.id;
        this.currencyPair = params.currenctyPair;
        this.exchange = params.exchange;
        this.traderId = params.traderId;
    }
    
    toDict() {
        return {
            id: this.id,
            currencyPair: this.currencyPair,
            exchange: this.exchange,
            traderId: this.traderId,
        }
    }
}

module.exports.Trade = Trade;
