import { createAction, props } from '@ngrx/store';
import { AssetData } from '../Entities/IAssetData';

export const loadPreciousMetalData = createAction('[PreciousMetal Component] Load Precious Metal Data', props<{ symbol: string }>());
export const loadPreciousMetalDataSuccess = createAction('[PreciousMetal Component] Load Precious Metal Data Success', props<{ data: AssetData[] }>());
export const loadPreciousMetalDataFailure = createAction('[PreciousMetal Component] Load Precious Metal Data Failure', props<{ error: any }>());