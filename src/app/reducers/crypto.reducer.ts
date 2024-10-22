import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { loadCryptoData, loadCryptoDataSuccess, loadCryptoDataFailure } from './../actions/crypto.actions';
import { AssetData } from '../Entities/IAssetData';

export const cryptoFeatureKey = 'crypto';

export interface State {
  data: AssetData[];
  error: any;
}

export const initialState: State = {
  data: [],
  error: null
};

export const reducer = createReducer(
  initialState,
  on(loadCryptoData, state => state),
  on(loadCryptoDataSuccess, (state, action) => ({ ...state, data: action.data })),
  on(loadCryptoDataFailure, (state, action) => ({ ...state, error: action.error })),
);

export const selectCryptoFeature = createFeatureSelector<State>(cryptoFeatureKey);

export const selectCryptoData = createSelector(
  selectCryptoFeature,
  (state: State) => state.data
);