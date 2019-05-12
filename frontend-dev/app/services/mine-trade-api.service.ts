import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { environment } from '../../environments/environment';
import { UrlUtils } from './url-utils';

@Injectable()
export class MineTradeApiService {

    private readonly baseUrl = environment.TRADE_APISERVER_URL;
    
    constructor(private http: HttpClient) {}

    getArbPositions(
        userId: string,
        currencyPair: string,
        startDate: number,
        endDate: number)
        : Observable<Object> {
        let url = this.baseUrl + 'arbPositions/' + userId;
        let params = { 'currency_pair': currencyPair };
        if (startDate) {
            params['start_date'] = startDate;
        }
        if (endDate) {
            params['end_date'] = endDate;
        }
        url = UrlUtils.makeQueryUrl(url, params);
        return this._get(url);
    }

    getAcitiveArbPositions(userId: string, currencyPair: string): Observable<Object> {
        let url = this.baseUrl + 'arbPositions/' + userId + '/active';
        url = UrlUtils.makeQueryUrl(url, {'currency_pair': currencyPair});
        return this._get(url);
    }

    getTicekrs(exchanges: string[], currencyPair: string) {
        const url = this.baseUrl + 'exchanges/tickers';
        return this._get(url, { 'exchanges': exchanges.join(','), 'currency_pair': currencyPair });
    }

    getAssets(userId: string, exchange: string, currencies: string[]) {
        const url = this.baseUrl + 'exchanges/assets';
        return this._get(url, {
            'userId': userId,
            'exchange': exchange,
            'currencies': currencies.join(',')
        });
    }

    closeArbPosition(
        userId: string,
        currencyPair: string,
        positionId: number,
        bidPrice: number,
        askPrice: number,
        amount: number,
        orderType: string) {
        const url = this.baseUrl + 'arbPositions/' + positionId.toString() + '/close';
        return this._post(url, {
            currency_pair: currencyPair,
            bid_price: bidPrice,
            ask_price: askPrice,
            amount: amount,
            order_type: orderType
        });
    }

    _get(url, params={}) {
      const options = {
          params: params,
          withCredentials: true
      }
      return this.http.get(url, options);
  }

  _post(url, params) {
      const options = {
          withCredentials: true
      }
      return this.http.post(url, params, options);
  }

  _put(url, params) {
      const options = {
          withCredentials: true
      }
      return this.http.put(url, params, options); 
  }

  _delete(url) {
      const options = {
          withCredentials: true
      }
      return this.http.delete(url, options);
  }
}
