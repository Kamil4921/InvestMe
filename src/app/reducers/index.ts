import { isDevMode } from '@angular/core';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import * as fromCrypto from './crypto.reducer';
import * as preciousMetal from './precious-metal.reducer';
import * as dashboard from './dashboard.reducer';

export interface State {
  [fromCrypto.cryptoFeatureKey]: fromCrypto.State;
  [preciousMetal.preciousMetalFeatureKey]: preciousMetal.State;
  [dashboard.dashboardFeatureKey]: dashboard.State;
}

export const reducers: ActionReducerMap<State> = {
  [fromCrypto.cryptoFeatureKey]: fromCrypto.reducer,
  [preciousMetal.preciousMetalFeatureKey]: preciousMetal.reducer,
  [dashboard.dashboardFeatureKey]: dashboard.reducer
};


export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
