export class Ticker {

    constructor(
        public readonly bestBidPrice: number,
        public readonly bestAskPrice: number,
        public readonly lastPrice: number,
        public readonly timestamp: number
    ) {}
}
