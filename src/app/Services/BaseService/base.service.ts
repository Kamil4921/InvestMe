import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private http: HttpClient = inject(HttpClient);
  private url: string = 'https://twelve-data1.p.rapidapi.com/price';

  getAssetPrice(symbol: string): Observable<{price:string}> {
    const options = {
      params: {
        symbol: symbol,
        format: 'json',
      },
      headers: {
        'X-RapidAPI-Key': 'c4754c7d28mshc01e8484802619dp198bbfjsndb89d073456a',
        'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
      }
    }

    try {
      let result = this.http.get<{price:string}>(this.url, options);
      return result !== undefined ? result : throwError(() => 'Result is undefined');
    } catch (error) {
      console.error(error);
      return throwError(() => error);
    }
  }
}
