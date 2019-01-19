import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { environment } from '../../environments/environment'

@Injectable()
export class MineTradeApiService {

    private readonly baseUrl = environment.TRADE_APISERVER_URL;
    
    constructor(private http: HttpClient) {}

    getArbPositions(userId: string): Observable<Object> {
        const url = this.baseUrl + 'arbPositions/' + '1';
        return this._get(url);
    }

    getTicekrs(exchanges: string[], currencyPair: string) {
        const url = this.baseUrl + 'exchanges/tickers';
        return this._get(url, { 'exchanges': exchanges.join(','), 'currency_pair': currencyPair });
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
