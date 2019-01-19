import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MineTradeApiService } from './mine-trade-api.service';
import { ArbPosition } from '../models/arb-position.model';
import { ArbPositionFactory } from '../models/arb-position-factory.model';

@Injectable()
export class ArbPositionService {

  constructor(private mineTradeApi: MineTradeApiService) { }

  getArbPositions(userId: string): Observable<ArbPosition[]> {
    return this.mineTradeApi.getArbPositions(userId).map(json => {
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
}
