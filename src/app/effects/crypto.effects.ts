import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { StockService } from '../Services/StockService/stock.service';
import * as CryptoActions from './../actions/crypto.actions';

@Injectable()
export class CryptoEffects {

  loadCryptoData$ = createEffect(() => this.actions$.pipe(
    ofType(CryptoActions.loadCryptoData),
    mergeMap((action) => this.stockService.getAssetData(action.symbol, '1day', '365')
      .pipe(
        map(data => CryptoActions.loadCryptoDataSuccess({ data: data.values })),
        catchError(() => EMPTY)
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private stockService: StockService
  ) {}
}