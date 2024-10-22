import { createAction, props } from '@ngrx/store';

export const openDialog = createAction('[Dashboard Component] Close Dialog');
export const closeDialog = createAction(
  '[Dashboard Component] Close Dialog',
  props<{ result: any }>()
);
