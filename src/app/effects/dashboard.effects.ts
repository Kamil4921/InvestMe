import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { AddAssetComponent } from '../add-asset/add-asset.component';
import { closeDialog, openDialog } from '../actions/dashboard.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class DashboardEffects {
  openDialog$ = createEffect(
    () =>
        this.actions$.pipe(
          ofType(openDialog),
          tap(() => {
            const dialogRef = this.dialog.open(AddAssetComponent, {
              width: '300px',
              disableClose: true,
            });
  
            dialogRef.afterClosed().subscribe((result) => {
              this.store.dispatch(closeDialog({ result }));
            });
          })
        ),
      { dispatch: false }
    );

  constructor(
    private actions$: Actions, 
    private dialog: MatDialog,
    private store: Store
    ) {}
}