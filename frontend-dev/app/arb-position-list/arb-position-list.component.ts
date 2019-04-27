import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

import { ArbPosition } from '../models/arb-position.model';
import { ArbPositionService } from '../services/arb-position.service';
import { MineTradeApiService } from '../services/mine-trade-api.service';
import { UserService } from '../services/user.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-arb-position-list',
  templateUrl: './arb-position-list.component.html',
  styleUrls: ['./arb-position-list.component.css']
})
export class ArbPositionListComponent implements OnInit, OnDestroy {
    arbPositions: ArbPosition[];
    selectedArbPositions: ArbPosition[];
    subscription: Subscription;
    selectMode: string;
    selectedCurrencyPair: string;

    constructor(
        private arbPositionService: ArbPositionService,
        private mineTradeService: MineTradeApiService,
        private userService: UserService) {
        this.arbPositions = [];
        this.selectedArbPositions = [];
        this.subscription = null;
        this.selectMode = 'all';
        this.selectedCurrencyPair = 'btc_jpy';
    }

    ngOnInit() {
        this.updatePositions();
        this.subscription = Observable.interval(60000)
        .subscribe(() => {
            this.updatePositions();
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    private updatePositions() {
        let user = this.userService.getUser();
        this.arbPositionService.getArbPositions('mineuser', this.selectedCurrencyPair).subscribe(arbPositions => {
            this.arbPositions = arbPositions;
            this,arbPositions.sort((a, b) => {
                if (a.timestamp < b.timestamp) return 1;
                if (a.timestamp > b.timestamp) return -1;
                return 0;
            });
            if (this.selectMode == 'open') {
                this.selectOpenArbPositions()
            } else if (this.selectMode == 'closed') {
                this.selectClosedArbPositions();
            } else {
                this.selectAll();
            }
        });
    }

    get totalProfit() {
        let sum = 0.0;
        for (let p of this.arbPositions) {
            sum += p.actualNetProfit
        }
        return Math.floor(sum * 1000) / 1000;
    }

    get unrealizedProfit() {
        let sum = 0.0;
        for (let p of this.arbPositions) {
            sum += p.unrealizedProfit;
        }
        return Math.floor(sum * 1000) / 1000;
    }

    get settleCurrency() {
        if (this.arbPositions.length == 0) {
            return '';
        } else {
            return this.arbPositions[0].settleCurrency;
        }
    }

    isPlus(value: number) {
        return value > 0;
    }
    isMinus(value: number) {
        return value < 0;
    }

    get allArbPositionCount() {
        if (this.arbPositions) {
            return this.arbPositions.length;
        } else {
            return 0;
        }
    }

    get openArbPositionCount() {
        if (this.arbPositions) {
            return this.arbPositions.filter(s => { return !s.isClosed; }).length;
        } else {
            return 0;
        }
    }

    get closedArbPositionCount() {
        if (this.arbPositions) {
            return this.arbPositions.filter(s => { return s.isClosed; }).length;
        } else {
            return 0;
        }
    }

    selectAll() {
        this.selectMode = 'all';
        this.selectedArbPositions = this.arbPositions;
    }

    selectOpenArbPositions() {
        this.selectMode = 'open';
        this.selectedArbPositions = this._getOpenArbPositions();
    }

    selectClosedArbPositions() {
        this.selectMode = 'closed';
        this.selectedArbPositions = this._getClosedArbPositions();
    }

    selectCurrencyPair(currencyPair: string) {
        this.selectedCurrencyPair = currencyPair;
        this.updatePositions();
    }

    _getOpenArbPositions() {
        return this.arbPositions.filter(s => { return !s.isClosed; });
    }

    _getClosedArbPositions() {
        return this.arbPositions.filter(s => { return s.isClosed; });
    }
}
