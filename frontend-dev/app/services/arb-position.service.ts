import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MineTradeApiService } from './mine-trade-api.service';
import { ArbPosition } from '../models/arb-position.model';
import { ArbPositionFactory } from '../models/arb-position-factory.model';

@Injectable()
export class ArbPositionService {

  constructor(private mineTradeApi: MineTradeApiService) { }

  getArbPositions(
    userId: string,
    currencyPair: string,
    startDate: number=null,
    endDate: number=null)
    : Observable<ArbPosition[]> {
    return this.mineTradeApi.getArbPositions(userId, currencyPair, startDate, endDate).map(json => {
        let positions: ArbPosition[] = [];
        for (let data of json['arb_positions']) {
            const position = ArbPositionFactory.create(data);
            if (position) {
              positions.push(position);
            }
        }
        return positions;
    });
  }

  getActiveArbPositions(userId: string, currencyPair: string) : Observable<ArbPosition[]> {
    return this.mineTradeApi.getAcitiveArbPositions(userId, currencyPair).map(json => {
        let positions: ArbPosition[] = [];
        for (let data of json['arb_positions']) {
            const position = ArbPositionFactory.create(data);
            if (position) {
              positions.push(position);
            }
        }
        return positions;
    });
  }
  closePosition(
    userId: string,
    position: ArbPosition,
    bidPrice: number,
    askPrice: number,
    amount: number,
    orderType: string) : Observable<ArbPosition> {
      return this.mineTradeApi.closeArbPosition(userId, position.currencyPair, position.id, bidPrice, askPrice, amount, orderType).map(json => {
        return position;
      });
    }
}
