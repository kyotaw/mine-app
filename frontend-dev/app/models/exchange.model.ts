import { ExchangePriceService } from '../services/exchange-price.service';


export class Exchange {
    _totalAsset: number;
    priceService: ExchangePriceService;

    constructor(
        public readonly name: string,
        public readonly positions: any[],
        public readonly asset: any,
        priceService: ExchangePriceService) {
        this._totalAsset = 0;
        this.priceService = priceService;
        const ticker = this.priceService.getTicker(this.name, 'btc_jpy')
        if (ticker) {
            this._totalAsset = asset['jpy']['balance'] + asset['btc']['balance'] * ticker.lastPrice;
        }
        
    }

    get totalAsset() {
        return this._totalAsset;
    }
    
    get jpy() {
        return this.asset['jpy']['balance'];
    }

    get btc() {
        return this.asset['btc']['balance'];
    }
    
    get totalPositions() {
        return this.positions.length
    }

    get longPositions() {
        let sum = 0;
        for (let p of this.positions) {
            if (p['side'] == 'long') {
                sum += 1;
            }
        }
        return sum;
    }

    get shortPositions() {
        let sum = 0;
        for (let p of this.positions) {
            if (p['side'] == 'short') {
                sum += 1;
            }
        }
        return sum;
    }

    get totalProfit() {
        let total = 0
        for (let p of this.positions) {
            total += p['profit']
        }
        return Math.floor(total)
    }
}
