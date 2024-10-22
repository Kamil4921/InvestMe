import { createAction, props } from '@ngrx/store';
import { AssetData } from '../Entities/IAssetData';

export const loadCryptoData = createAction('[Crypto Component] Load Crypto Data', props<{ symbol: string }>());
export const loadCryptoDataSuccess = createAction('[Crypto Component] Load Crypto Data Success', props<{ data: AssetData[] }>());
export const loadCryptoDataFailure = createAction('[Crypto Component] Load Crypto Data Failure', props<{ error: any }>());