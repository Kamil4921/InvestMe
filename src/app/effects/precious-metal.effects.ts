import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as PrecoiusMetalActions from './../actions/precious-metal.actions'
import { StockService } from '../Services/StockService/stock.service';

@Injectable()
export class PreciousMetalEffects {

  loadPreciousMetalData$ = createEffect(() => this.actions$.pipe(
    ofType(PrecoiusMetalActions.loadPreciousMetalData),
    mergeMap((action) => this.stockService.getAssetData(action.symbol, '1day', '365')
      .pipe(
        map(data => PrecoiusMetalActions.loadPreciousMetalDataSuccess({ data: data.values })),
        catchError(() => EMPTY)
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private stockService: StockService
  ) {}
}