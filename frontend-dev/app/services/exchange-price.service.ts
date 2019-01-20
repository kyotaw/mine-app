import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MineTradeApiService } from './mine-trade-api.service';
import { Ticker } from '../models/ticker.model';


@Injectable()
export class ExchangePriceService {

    priceStore: any;
    expireInterval: number;

    constructor(private mineTradeApi: MineTradeApiService) {
        this.priceStore = {};
        this.expireInterval = 1000;
    }

    ngOnInit() {}

    getTicker(exchange: string, currencyPair: string): Observable<Ticker> {
        if (this.priceStore[exchange] && this.priceStore[exchange][currencyPair]) {
            let ticker = this.priceStore[exchange][currencyPair];
            if ((new Date().getTime() - ticker.timestamp) <= this.expireInterval) {
                return Observable.create((observer) => {
                    observer.next(ticker);
                });
            }
        }
        if (!this.priceStore[exchange]) {
            this.priceStore[exchange] = {};
        }

        return Observable.create((observer) => {
            this.mineTradeApi.getTicekrs([exchange], currencyPair).subscribe(json => {
                    if (!json[exchange]) {
                        observer.error('invalid exchange ' + exchange);
                    } else {
                        let data = json[exchange];
                        let ticker = new Ticker(
                            data['best_bid_price'],
                            data['best_ask_price'],
                            data['last_price'],
                            data['timestamp']);
                        this.priceStore[exchange][currencyPair] = ticker;
                        observer.next(ticker);
                    }
                });
            });
    }
}