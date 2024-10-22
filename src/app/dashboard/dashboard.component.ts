import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddAssetComponent } from '../add-asset/add-asset.component';
import { BehaviorSubject } from 'rxjs';
import { Asset } from '../Entities/IAsset';
import { CryptoService } from '../Services/CryptoService/crypto.service';
import { Observable } from 'rxjs';
import { Crypto } from '../Entities/ICrypto';
import { BaseService } from '../Services/BaseService/base.service';
import { SpeachToTextService } from '../Services/SpeachToText/speach-to-text.service';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as DashboardActions from './../actions/dashboard.actions';
import * as fromDashboard from './../reducers/dashboard.reducer';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  providers: [DatePipe],
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  protected assets$: BehaviorSubject<Asset[]> = new BehaviorSubject<Asset[]>([]);
  protected btc$!: Observable<Crypto>;

  private readonly STORAGE_KEY = 'assets';
  
  constructor(
    private datePipe: DatePipe,
    private cryptoService: CryptoService,
    private baseService: BaseService,
    private dialog: MatDialog,
    private speachService: SpeachToTextService,
    private router: Router,
    private store: Store
  ) {
    this.btc$ = this.cryptoService.getBTCPrice();
    this.loadAssets();
    this.speachService.init();
  }

  ngOnInit(): void {
    this.speachService.start();

    this.speachService.recognition.addEventListener('result', (e: any) => {
      let last = e.results.length - 1;
      let command = e.results[last][0].transcript;
      this.handleCommand(command);
    });
  }

  protected Remove(asset: Asset): void {
    let assets: Asset[] = [...this.assets$.getValue()];
    let index = assets.findIndex((a) => a === asset);

    assets.splice(index, 1);
    this.assets$.next(assets);
    this.saveAssets(assets);
  }

  protected openDialog(): void {
    this.store.dispatch(DashboardActions.openDialog());
    this.store.pipe(select(fromDashboard.selectDialogData)).subscribe((newAsset) => {
      if (newAsset !== undefined) {
        if (newAsset.type === 'Krypto') {
          this.btc$ = this.cryptoService.getBTCPrice();
          let assets = this.assets$.getValue();
          assets.push(newAsset);
          this.assets$.next(assets);
          this.saveAssets(assets);
        } else {
          this.baseService.getAssetPrice(newAsset.ticker).subscribe((a) => {
            newAsset.currentPrice = a.price;
            newAsset.buyDate = this.datePipe.transform(newAsset.buyDate, 'dd.MM.yyyy');
            let assets = this.assets$.getValue();
            assets.push(newAsset);
            this.assets$.next(assets);
            this.saveAssets(assets);
          });
        }
      }
    })
    // const dialogRef = this.dialog.open(AddAssetComponent, {
    //   width: '300px',
    //   disableClose: true,
    // });

    // dialogRef.afterClosed().subscribe((newAsset) => {
    //   if (newAsset !== undefined) {
    //     if (newAsset.type === 'Krypto') {
    //       this.btc$ = this.cryptoService.getBTCPrice();
    //       let assets = this.assets$.getValue();
    //       assets.push(newAsset);
    //       this.assets$.next(assets);
    //       this.saveAssets(assets);
    //     } else {
    //       this.baseService.getAssetPrice(newAsset.ticker).subscribe((a) => {
    //         newAsset.currentPrice = a.price;
    //         newAsset.buyDate = this.datePipe.transform(newAsset.buyDate, 'dd.MM.yyyy');
    //         let assets = this.assets$.getValue();
    //         assets.push(newAsset);
    //         this.assets$.next(assets);
    //         this.saveAssets(assets);
    //       });
    //     }
    //   }
    // });
  }

  private handleCommand(command: string) : void {
    let words = command.split(' ');

    if (words.length >= 3 && (words[0].toLowerCase() === 'idź' || words[0].toLowerCase() === 'iść') && words[1] === 'do') {
      let page = words.slice(2).join(' ').toLowerCase();

      switch (page) {
        case 'główna':
          this.router.navigateByUrl('/home');
          break;
        case 'gówna':
          this.router.navigateByUrl('/home');
          break;
        case 'akcje':
          this.router.navigateByUrl('/stock');
          break;
        case 'akcji':
          this.router.navigateByUrl('/stock');
          break;
        case 'etf':
          this.router.navigateByUrl('/etf');
          break;
        case 'krypto':
          this.router.navigateByUrl('/crypto');
          break;
        case 'metal':
          this.router.navigateByUrl('/metal');
          break;
        default:
          this.router.navigateByUrl('/home');
      }
    }
  }

  private saveAssets(assets: Asset[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(assets));
  }

  private loadAssets(): void {
    const assets = localStorage.getItem(this.STORAGE_KEY);
    if (assets) {
      this.assets$.next(JSON.parse(assets));
    }
  }
}
