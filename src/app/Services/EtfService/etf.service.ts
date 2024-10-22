import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { EtfList } from '../../Entities/IEtf';

@Injectable({
  providedIn: 'root'
})
export class EtfService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl: string = 'https://twelve-data1.p.rapidapi.com';
  
  getEtfsList(exchange: string): Observable<EtfList> {
    const options = {
      params: {
        exchange: exchange,
        format: 'json',
      },
      headers: {
        'X-RapidAPI-Key': 'c4754c7d28mshc01e8484802619dp198bbfjsndb89d073456a',
        'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com',
      },
    };

    try {
      let result = this.http.get<EtfList>(this.baseUrl + '/etf', options);
      return result !== undefined
        ? result
        : throwError(() => 'Result is undefined');
    } catch (error) {
      console.log(error);
      return throwError(() => error);
    }
  }
}
