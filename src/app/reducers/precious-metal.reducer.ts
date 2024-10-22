import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { AssetData } from '../Entities/IAssetData';
import { loadPreciousMetalData, loadPreciousMetalDataSuccess } from '../actions/precious-metal.actions';
import { loadCryptoDataFailure } from '../actions/crypto.actions';

export const preciousMetalFeatureKey = 'precious-metal';

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
  on(loadPreciousMetalData, state => state),
  on(loadPreciousMetalDataSuccess, (state, action) => ({ ...state, data: action.data })),
  on(loadCryptoDataFailure, (state, action) => ({ ...state, error: action.error })),
);

export const selectPreciousMetalFeature = createFeatureSelector<State>(preciousMetalFeatureKey);

export const selectPreciousMetalData = createSelector(
  selectPreciousMetalFeature,
  (state: State) => state.data
);