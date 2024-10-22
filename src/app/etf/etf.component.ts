import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BaseChartDirective } from 'ng2-charts';
import { StockService } from '../Services/StockService/stock.service';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Exchange } from '../Entities/IExchange';
import { Etf } from '../Entities/IEtf';
import { EtfService } from '../Services/EtfService/etf.service';
import { AssetData } from '../Entities/IAssetData';
import { SpeachToTextService } from '../Services/SpeachToText/speach-to-text.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FavouritesAssets } from '../Entities/IFavouritesAssets';
import { Stock } from '../Entities/IStock';

@Component({
  selector: 'app-etf',
  standalone: true,
  imports: [
    BaseChartDirective,
    MatFormFieldModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    AsyncPipe,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './etf.component.html',
  styleUrl: './etf.component.scss'
})
export class EtfComponent implements OnInit, AfterViewInit {
  protected selectedExchange: string = '';
  protected selectedETF: string = '';  
  
  protected exchangeList$: BehaviorSubject<Exchange[]> = new BehaviorSubject<Exchange[]>([]);
  protected etfList$: BehaviorSubject<Etf[]> = new BehaviorSubject<Etf[]>([]);

  protected isVisible: boolean = false;
  protected isEtfVisible: boolean = false;
  
  protected lineChartData = [{ data: [] as number[] }];
  protected lineChartLabels = [] as string[];
  protected lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  protected lineChartColors = [
    {
      borderColor: 'black', 
      backgroundColor: 'rgba(255,0,0,0.3)',
    }
  ];
  protected lineChartLegend = false;
  protected lineChartType = 'line';
  protected lineChartPlugins = [];

  private stockService = inject(StockService);
  private etfService = inject(EtfService);
  private speachService = inject(SpeachToTextService);
  private etfData$: BehaviorSubject<AssetData[]> = new BehaviorSubject<AssetData[]>([]);

  private readonly STORAGE_KEY = 'favouriteAssets';

  ngOnInit(): void {
    this.stockService
      .getExchanges()
      .subscribe((exchanges) => this.exchangeList$.next(exchanges.data));
  }

  ngAfterViewInit(): void {
    this.speachService.recognition.addEventListener('result', (e: any) => {
      let last = e.results.length - 1;
      let command = e.results[last][0].transcript;
      this.handleCommand(command);
    });
  }

  protected onExchangeChange(value: string): void {
    this.etfService.getEtfsList(value).subscribe((etfList) =>
      this.etfList$.next(
        etfList.data.sort((a, b) => {
          if (a.symbol < b.symbol) {
            return -1;
          }
          return 1;
        })
      )
    );

    this.isEtfVisible = true;
  }

  protected onEtfChange(value: string): void {
    this.stockService.getAssetData(value, '1day', '365').subscribe((x) => {
      this.etfData$.next(x.values);
      const chartData = x.values.map((v) => parseFloat(v.close));
      const chartLabels = x.values.map((t) => t.datetime);

      this.lineChartData = [{ data: chartData.reverse() }];
      this.lineChartLabels = chartLabels.reverse();
    });

    this.isVisible = true;
  }
  
  protected AddToFavourites(selectedETF: string): void {
    let savedAssets: FavouritesAssets;
    savedAssets = this.loadFavouriteAssets();
    let toSave = this.etfList$.value.find(e => e.symbol === selectedETF);

    if(toSave){
      savedAssets.etfs.push(toSave);
      this.saveFavouriteStock(savedAssets);
    }
  }

  private saveFavouriteStock(assets: FavouritesAssets): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(assets));
  }

  private loadFavouriteAssets(): FavouritesAssets {
    let favourtitesAssets = localStorage.getItem(this.STORAGE_KEY);
    if (favourtitesAssets) {
      return JSON.parse(favourtitesAssets) as FavouritesAssets;
    }
    let newFavourites: FavouritesAssets = {} as FavouritesAssets;
    newFavourites.stocks = [] as Stock[];
    newFavourites.etfs = [] as Etf[];
    return newFavourites;
  }

  private handleCommand(command: string): void {
    let words = command.split(' ');

    if (words[0].toLowerCase() === 'wybierz' || words[0].toLowerCase() === 'wybrać') {
      let choice = words.slice(1,2).join(' ').toLowerCase();
      let subchoice = words.slice(2).join(' ').toUpperCase();

      switch(choice) {
        case 'giełda':
          this.selectedExchange = subchoice;
          this.onExchangeChange(subchoice);
          break;
        case 'giełdę':
          this.selectedExchange = subchoice;
          this.onExchangeChange(subchoice);
          break;
        case 'etf':
          this.selectedETF = subchoice.toUpperCase();
          this.onEtfChange(subchoice);
          break;
        default:
          break;
      }
    }
  }
}
