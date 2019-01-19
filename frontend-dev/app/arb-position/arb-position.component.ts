import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ArbPosition } from '../models/arb-position.model';


@Component({
  selector: 'app-arb-position',
  templateUrl: './arb-position.component.html',
  styleUrls: ['./arb-position.component.css']
})
export class ArbPositionComponent implements OnInit {

    @Input() position: ArbPosition;
    
    constructor() {}

    ngOnInit() {
        /*
        Observable.interval(5000)
            .subscribe(() => this.channelService.getChannel(this.sensor).subscribe(channel => {
                this.channel = channel;
                this.sensor.status = channel.status;
            }));
        */
    }
    get profit() {
        let p = Math.floor(this.position.actualNetProfit);
        if (p > 0) {
            return '+' + p.toString();
        } else {
            return p.toString();
        }
    }

    get profitRatio() {
        let p = Math.floor(this.position.actualExitProfitRatio * 10000) / 100;
        if (p > 0) {
            return '+' + p.toString();
        } else {
            return p.toString();
        }
    }

    get initialSpread() {
        return Math.floor(this.position.openAskPrice - this.position.openBidPrice);
    }

    get currentSpread() {
        return 100;
    }

    get targetSpread() {
        return 10;
    }

    get isPlusProfit() {
        return this.position.actualNetProfit > 0
    }

    get isMinusProfit() {
        return this.position.actualNetProfit < 0
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
