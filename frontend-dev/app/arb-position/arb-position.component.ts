import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

import { ArbPosition } from '../models/arb-position.model';
import { Ticker } from '../models/ticker.model';
import { ExchangePriceService } from '../services/exchange-price.service';
import { ArbPositionService } from '../services/arb-position.service';


@Component({
  selector: 'app-arb-position',
  templateUrl: './arb-position.component.html',
  styleUrls: ['./arb-position.component.css']
})
export class ArbPositionComponent implements OnInit, OnDestroy {

    @Input() position: ArbPosition;
    
    private bidExchangeTicker: Ticker;
    private askExchangeTicker: Ticker;
    private subscription: Subscription;
    private isOverview: boolean;
    public details: any[];
    public displayedDetailColumns = ['bidExchangeDetail', 'itemName', 'askExchangeDetail'];
    
    constructor(private priceService: ExchangePriceService, private arbPositionService: ArbPositionService) {
        this.bidExchangeTicker = null;
        this.askExchangeTicker = null;
        this.subscription = null;
        this.isOverview = true;
        this.details = [];
    }

    ngOnInit() {
        this.getTickers();

        this.subscription = Observable.interval(3000)
            .subscribe(() => {
                this.getTickers();
                this.details = this.buildDetails();
            });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    showDetail() {
        this.isOverview = false;
    }
    
    showOverview() {
        this.isOverview = true;
    }

    private getTickers() {
        this.bidExchangeTicker = this.priceService.getTicker(this.position.bidPosition['exchange'], this.position.currencyPair);
        this.askExchangeTicker = this.priceService.getTicker(this.position.askPosition['exchange'], this.position.currencyPair);
    }

    private buildDetails() {
        let details = [];
        details.push({
            'itemName': '取引所名',
            'bidExchangeDetailValue': this.position.openBidExchange,
            'askExchangeDetailValue': this.position.openAskExchange,
        });
        details.push({
            'itemName': '状態',
            'bidExchangeDetailValue': this.position.bidPosition['status'],
            'askExchangeDetailValue': this.position.askPosition['status'],
        });
        details.push({
            'itemName': '残数量',
            'bidExchangeDetailValue': this.position.bidPosition['balance'],
            'askExchangeDetailValue': this.position.askPosition['balance'],
        });
        details.push({
            'itemName': 'オープン価格(手数料)',
            'bidExchangeDetailValue': this.position.bidPosition['open_price'] + '(' + this.position.bidPosition['open_commission'] + ')',
            'askExchangeDetailValue': this.position.askPosition['open_price'] + '(' + this.position.askPosition['open_commission'] + ')',
        });
        details.push({
            'itemName': 'オープンスリッページ',
            'bidExchangeDetailValue': this.position.bidPosition['open_price'] - this.position.openBidPrice,
            'askExchangeDetailValue': this.position.askPosition['open_price'] - this.position.openAskPrice,
        });
        details.push({
            'itemName': 'クローズ価格(手数料)',
            'bidExchangeDetailValue': this.position.bidPosition['close_price'] + '(' + this.position.bidPosition['close_commission'] + ')',
            'askExchangeDetailValue': this.position.askPosition['close_price'] + '(' + this.position.askPosition['close_commission'] + ')',
        });
        details.push({
            'itemName': 'クローズスリッページ',
            'bidExchangeDetailValue': this.position.bidPosition['close_price'] - this.position.closeAskPrice,
            'askExchangeDetailValue': this.position.askPosition['close_price'] - this.position.closeBidPrice,
        });
        details.push({
            'itemName': '現在価格',
            'bidExchangeDetailValue': this.bidExchangeTicker ? this.bidExchangeTicker.bestBidPrice : '-',
            'askExchangeDetailValue': this.askExchangeTicker ? this.askExchangeTicker.bestAskPrice : '-',
        });

        details.push({
            'itemName': '予想利益',
            'bidExchangeDetailValue': this.unrealizedBidProfit,
            'askExchangeDetailValue': this.unrealizedAskProfit,
        });
        return details;
    }

    close_position() {
        this.arbPositionService.closePosition(
            "",
            this.position,
            this.bestAsk,
            this.bestBid,
            this.amount,
            "market").subscribe(position => {
                this.position = position;
            });
    }

    get settleCurrency() {
        return this.position.settleCurrency.toUpperCase();
    }

    get unrealizedProfitSigned() {
        let p = Math.floor(this.unrealizedProfit * 1000) / 1000;
        if (p > 0) {
            return '+' + p.toString();
        } else {
            return p.toString();
        }
    }

    get unrealizedProfit() {
        this.position.unrealizedProfit = this.unrealizedBidProfit + this.unrealizedAskProfit;
        return this.position.unrealizedProfit;
    }

    get unrealizedBidProfit() {
        if (this.bestBid == 0) {
            return 0;
        }
        return (this.bestBid - this.position.bidPosition['open_price']) * this.position.bidPosition['balance']
            + this.position.bidPosition['profit']
            - this.position.bidPosition['open_commission'] * this.position.bidPosition['balance'] / this.position.bidPosition['open_amount'];
    }

    get unrealizedAskProfit() {
        if (this.bestAsk == 0) {
            return 0;
        }
        return (this.position.askPosition['open_price'] - this.bestAsk) * this.position.askPosition['balance']
            + this.position.askPosition['profit']
            - this.position.askPosition['open_commission'] * this.position.askPosition['balance'] / this.position.askPosition['open_amount'];
    }

    get profitRatio() {
        let p = Math.floor(this.position.actualExitProfitRatio * 10000) / 10000;
        if (p > 0) {
            return '+' + p.toString();
        } else {
            return p.toString();
        }
    }

    get initialSpread() {
        return Math.floor(this.position.openSpread)
    }

    get closeSpread() {
        return Math.floor(this.position.closeSpread)
    }

    get currentSpread() {
        if (!this.bidExchangeTicker || !this.askExchangeTicker) {
            return '-'
        } else {
            let bestAsk = this.bestAsk;
            let bestBid = this.bestBid;
            let spread =  bestAsk - bestBid;
            return Math.floor(spread);
        }
    }

    get bestAsk() {
        if (!this.askExchangeTicker) {
            return 0;
        }
        return this.position.isAskPositionClosed ? this.position.askPosition['close_price'] : this.askExchangeTicker.bestAskPrice;
    }

    get bestBid() {
        if (!this.bidExchangeTicker) {
            return 0;
        }
        return this.position.isBidPositionClosed ? this.position.bidPosition['close_price'] : this.bidExchangeTicker.bestBidPrice;
    }

    get targetSpread() {
        return Math.floor(this.position.targetSpread);
    }

    get targetSpreadDiff() {
        if (this.position.isClosed || this.position.isOpening || this.currentSpread == '-') {
            return '-';
        } else {
            return Math.floor(this.currentSpread - this.position.targetSpread);
        }
    }

    get isClosed() {
        return this.position.isClosed;
    }

    get isPlusProfit() {
        return this.unrealizedProfit > 0
    }

    get isMinusProfit() {
        return this.unrealizedProfit < 0
    }
    
    get state() {
        if (this.position.isOpen) {
            return 'オープン'
        } else if (this.position.isOpening) {
            return 'オープン待ち'
        } else if (this.position.isClosed) {
            return 'クローズ'
        } else if (this.position.isClosing) {
            return 'クローズ待ち'
        } else if (this.position.isPartial) {
            return '部分約定'
        } else {
            return '不明'
        }
    }

    get bidExchange() {
        return this.position.bidPosition['exchange'];
    }
    
    get askExchange() {
        return this.position.askPosition['exchange'];
    }

    get amount() {
        return this.position.openAmount;
    }

    get bidOpenStatus() {
        if (!this.bidExchangeTicker) {
            return '';
        }
        if (this.position.bidPosition['status'] == 'opening') {
            return '(' + this.bidExchangeTicker.bestAskPrice + ' / ' + this.position.openBidPrice +  ')';
        } else if (this.position.bidPosition['status'] == 'closing') {
            return '(' + this.bidExchangeTicker.bestBidPrice + ' / ' + this.position.closeAskPrice +  ')';
        } else {
            return ''
        }
    }

    get askOpenStatus() {
        if (!this.askExchangeTicker) {
            return '';
        }
        if (this.position.askPosition['status'] == 'opening') {
            return '(' + this.askExchangeTicker.bestBidPrice + ' / ' + this.position.openAskPrice +  ')';
        } else if (this.position.askPosition['status'] == 'closing') {
            return '(' + this.askExchangeTicker.bestAskPrice + ' / ' + this.position.closeBidPrice +  ')';
        } else {
            return ''
        }
    }

    get openDate() {
        let ts = this.position.openTimestamp;
        return ts > 0 ? this.toYMDhms(ts) : '-';
    }

    get closeDate() {
        let ts = this.position.closeTimestamp;
        return ts > 0 ? this.toYMDhms(ts) : '-';
    }

    toYMDhms(ts) {
        let d = new Date(ts);
        let year  = d.getFullYear();
        let month = d.getMonth() + 1;
        let day  = d.getDate();
        let hour = (d.getHours() < 10) ? '0' + d.getHours() : d.getHours();
        let min  = (d.getMinutes() < 10) ? '0' + d.getMinutes() : d.getMinutes();
        let sec   = (d.getSeconds() < 10) ? '0' + d.getSeconds() : d.getSeconds();
        return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
    }
}
