import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { StockList } from '../../Entities/IStock';
import { ExchangeResult } from '../../Entities/IExchange';
import { AssetDataResult } from '../../Entities/IAssetData';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl: string = 'https://twelve-data1.p.rapidapi.com';

  getExchanges(): Observable<ExchangeResult> {
    const options = {
      params: {
        format: 'json'
      },
      headers: {
        'X-RapidAPI-Key': 'c4754c7d28mshc01e8484802619dp198bbfjsndb89d073456a',
        'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
      },
    };

    try {
      let result = this.http.get<ExchangeResult>(this.baseUrl + '/exchanges', options);
      return result !== undefined ? result : throwError(() => 'Result is undefined');
    } catch (error) {
      console.log(error);
      return throwError(() => error);
    }
  }

  getAssetData(symbol: string, interval: string, outputsize: string): Observable<AssetDataResult> {
    const options = {
      params: {
        symbol: symbol,
        interval: interval,
        outputsize: outputsize,
        format: 'json'
      },
      headers: {
        'X-RapidAPI-Key': 'c4754c7d28mshc01e8484802619dp198bbfjsndb89d073456a',
        'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
      }
    };

    try {
      let result = this.http.get<AssetDataResult>(this.baseUrl + '/time_series', options);
      return result !== undefined ? result : throwError(() => 'Result is undefined');
    } catch (error) {
      console.log(error);
      return throwError(() => error);
    }
  }

  getStocksList(exchange: string = 'NYSE'): Observable<StockList> {
    const options = {
      params: {
        exchange: exchange,
        format: 'json'
      },
      headers: {
        'X-RapidAPI-Key': 'c4754c7d28mshc01e8484802619dp198bbfjsndb89d073456a',
        'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
      }
    };

    try {
      let result = this.http.get<StockList>(this.baseUrl + '/stocks', options);
      return result !== undefined ? result : throwError(() => 'Result is undefined');
    } catch (error) {
      console.log(error);
      return throwError(() => error);
    }
  }
}
