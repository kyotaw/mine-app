export enum CurrencyPair {
    btc_jpy = 'btc_jpy',
    eth_btc = 'eth_btc',
}


class Currency {
    constructor(public readonly c: string)
    {
    }
}