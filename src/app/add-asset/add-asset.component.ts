import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogContent, MatDialogActions, MatDialogClose} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Asset } from '../Entities/IAsset';

@Component({
  selector: 'app-add-asset',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogClose,
    MatDatepickerModule,
    AsyncPipe,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-asset.component.html',
  styleUrl: './add-asset.component.scss',
})
export class AddAssetComponent implements OnInit {
  myControl = new FormControl('');
  options: string[] = ['ETF', 'Akcja', 'Metal Szlachetny', 'Krypto'];
  filteredOptions$!: Observable<string[]>;
  maxDate: Date;

  form: Asset = {
    type: '',
    name: '',
    ticker: '',
    buyDate: new Date(),
    amount: 0,
    price: 0,
    currentPrice: 0
  };

  constructor(public dialogRef: MatDialogRef<AddAssetComponent>) {
    const currentDay = new Date().getDate();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(currentYear, currentMonth, currentDay);
  }

  ngOnInit() {
    this.filteredOptions$ = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  protected onSaveClick(): void {
    this.dialogRef.close(this.form);
  }

  protected onNoClick(): void {
    this.dialogRef.close();
  }
}
