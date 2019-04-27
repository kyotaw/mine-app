import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MineTradeApiService } from './mine-trade-api.service';
import { Ticker } from '../models/ticker.model';


@Injectable()
export class ExchangePriceService {

    priceStore: any;
    expireInterval: number;
    exchanges: any;

    constructor(private mineTradeApi: MineTradeApiService) {
        this.priceStore = {}
        this.expireInterval = 1000;
        this.exchanges = {
            'Zaif': ['btc_jpy'],
            'bitFlyer': ['btc_jpy'],
            'bitbank': ['btc_jpy'],
            'BITPoint': ['btc_jpy'],
            'coincheck': ['btc_jpy'],
            'Liquid': ['btc_jpy', 'btc_usd'],
            'Binance': ['btc_usd'],
            'BTCBOX': ['btc_jpy'],
            'BitForex': ['btc_usd'],
            'OKEX': ['btc_usd'],
        };
        this.fetchTickers();
        Observable.interval(30000)
            .subscribe(() => {
                this.fetchTickers();
            });
    }
    ngOnInit() {
    }

    private fetchTickers() {
        for (let e in this.exchanges) {
            for (let c of this.exchanges[e]) {
                this.mineTradeApi.getTicekrs([e], c).subscribe(json => {
                    if (json[e]) {
                        let data = json[e];
                        let ticker = new Ticker(
                            data['best_bid_price'],
                            data['best_ask_price'],
                            data['last_price'],
                            data['timestamp']);
                        if (!this.priceStore[e]) {
                            this.priceStore[e] = {};
                        }
                        this.priceStore[e][c] = ticker;
                    }
                });
            }
        }
    }

    getTicker(exchange: string, currencyPair: string): Ticker {
        if (this.priceStore[exchange] && this.priceStore[exchange][currencyPair]) {
            return this.priceStore[exchange][currencyPair];
        } else {
            return null;
        }
    }
}