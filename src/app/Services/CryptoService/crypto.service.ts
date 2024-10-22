import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Crypto } from '../../Entities/ICrypto';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {

  private http: HttpClient = inject(HttpClient);
  private url: string = 'https://binance43.p.rapidapi.com/ticker/24hr?symbol=BTCUSDT';
  private options = {
    headers: {
      'X-RapidAPI-Key': 'c4754c7d28mshc01e8484802619dp198bbfjsndb89d073456a',
      'X-RapidAPI-Host': 'binance43.p.rapidapi.com',
    },
  };

  getBTCPrice(): Observable<Crypto> {
    return this.http.get<Crypto>(this.url, this.options);
  }
}
