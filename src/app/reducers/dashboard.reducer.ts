import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import * as dashboardActions from './../actions/dashboard.actions';

export const dashboardFeatureKey = 'dashboard';

export interface State {
  isOpen: boolean;
  data: any;
}

export const initialState: State = {
  isOpen: false,
  data: {},
};

export const reducer = createReducer(
  initialState,
  on(dashboardActions.openDialog, (state) => ({
    ...state,
    isOpen: true,
  })),
  on(dashboardActions.closeDialog, (state, { result }) => {
    return { ...state, isOpen: false, data: result };
  })
);

export const selectDashboardFeature =
  createFeatureSelector<State>(dashboardFeatureKey);

export const selectDialogData = createSelector(
  selectDashboardFeature,
  (state: State) => state.data
);
