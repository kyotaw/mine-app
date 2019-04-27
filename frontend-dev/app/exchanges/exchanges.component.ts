import { Component, OnInit, NgZone } from '@angular/core';

import { UserService } from '../services/user.service';
import { ExchangePriceService } from '../services/exchange-price.service';
import { ArbPositionService } from '../services/arb-position.service';
import { MineTradeApiService } from '../services/mine-trade-api.service';
import { Exchange } from '../models/exchange.model';
import { ArbPosition } from '../models/arb-position.model';
import { Observable } from 'rxjs';


@Component({
   selector: 'app-exchanges',
   templateUrl: './exchanges.component.html',
   styleUrls: ['./exchanges.component.css']
})
export class ExchangesComponent implements OnInit {
    public exchanges: any[];
    public displayedColumns: string[] = ['name', 'asset', 'profit', 'jpy', 'btc', 'long', 'short'];
    private supportedExchanges: string[] = ['bitbank', 'Zaif', 'bitFlyer', 'BITPoint', 'coincheck', 'Liquid', 'Binance', 'OKEX', 'BitForex', 'BTCBOX'];

    constructor(
        private userService: UserService,
        private priceService: ExchangePriceService,
        private arbPositionService: ArbPositionService,
        private mineTradeService: MineTradeApiService,
        private zone: NgZone) {
        this.exchanges = [];
    }

  ngOnInit() {
      let user = this.userService.getUser();
      this.arbPositionService.getArbPositions('mineuser').subscribe(arbPositions => {
          this.buildExchanges(arbPositions)
      });
  }

  buildExchanges(arbPositions: ArbPosition[]) {
      let positions = {};
      for (let e of this.supportedExchanges) {
          positions[e] = [];
      }
      for (let p of arbPositions) {
        positions[p.openBidExchange].push(p.bidPosition);
        positions[p.openAskExchange].push(p.askPosition);
      }

      let allAssets = {name: '総計', totalAsset: 0, totalProfit: 0, jpy: 0, btc: 0, longPositions: 0, shortPositions: 0};
      this.exchanges.push(allAssets);
      let user = this.userService.getUser();
      for (let e in positions) {
        this.mineTradeService.getAssets(user.userId, e, ['jpy', 'btc']).subscribe((assets) => {
            const exchange = new Exchange(e, positions[e], assets, this.priceService);
            let allAssets = this.exchanges[this.exchanges.length - 1]
            allAssets.totalAsset += exchange.totalAsset;
            allAssets.totalProfit += exchange.totalProfit;
            allAssets.jpy += exchange.jpy;
            allAssets.btc += exchange.btc;
            allAssets.longPositions += exchange.longPositions;
            allAssets.shortPositions += exchange.shortPositions;
            this.exchanges.splice(this.exchanges.length - 1, 0, exchange);
            this.exchanges = this.exchanges.slice(0, this.exchanges.length);
        });
      }
  }
}
