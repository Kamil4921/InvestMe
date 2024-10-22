import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BaseChartDirective } from 'ng2-charts';
import { StockService } from '../Services/StockService/stock.service';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Stock } from '../Entities/IStock';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Exchange } from '../Entities/IExchange';
import { AssetData } from '../Entities/IAssetData';
import { SpeachToTextService } from '../Services/SpeachToText/speach-to-text.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FavouritesAssets } from '../Entities/IFavouritesAssets';
import { Etf } from '../Entities/IEtf';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [
    BaseChartDirective,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    AsyncPipe,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss',
})
export class StockComponent implements OnInit, AfterViewInit {
  protected selectedExchange: string = '';
  protected selectedStock: string = '';  
  
  protected exchangeList$: BehaviorSubject<any[]> = new BehaviorSubject<Exchange[]>([]);
  protected stockList$: BehaviorSubject<Stock[]> = new BehaviorSubject<Stock[]>([]);
  
  protected isVisible: boolean = false;
  protected isStocksVisible: boolean = false;
  
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
    },
  ];
  protected lineChartLegend = false;
  protected lineChartType = 'line';
  protected lineChartPlugins = [];

  private stockService = inject(StockService);
  private speachService = inject(SpeachToTextService);
  private stockData$: BehaviorSubject<AssetData[]> = new BehaviorSubject<AssetData[]>([]);

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
    this.stockService.getStocksList(value).subscribe((stockList) =>
      this.stockList$.next(
        stockList.data.sort((a, b) => {
          if (a.symbol < b.symbol) {
            return -1;
          }
          return 1;
        })
      )
    );

    this.isStocksVisible = true;
  }

  protected onStockChange(value: string): void {
    this.stockService.getAssetData(value, '1day', '365').subscribe((x) => {
      this.stockData$.next(x.values);
      const chartData = x.values.map((v) => parseFloat(v.close));
      const chartLabels = x.values.map((t) => t.datetime);

      this.lineChartData = [{ data: chartData.reverse() }];
      this.lineChartLabels = chartLabels.reverse();
    });

    this.isVisible = true;
  }

  protected AddToFavourites(selectedStock: string): void {
    let savedAssets: FavouritesAssets;
    savedAssets = this.loadFavouriteAssets();
    let toSave = this.stockList$.value.find(s => s.symbol === selectedStock);

    if(toSave){
      savedAssets.stocks.push(toSave);
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
        case 'akcji':
          this.selectedStock = subchoice.toUpperCase();
          this.onStockChange(subchoice);
          break;
        case 'akcję':
          this.selectedStock = subchoice.toUpperCase();
          this.onStockChange(subchoice);
          break;
        case 'akcje':
          this.selectedStock = subchoice.toUpperCase();
          this.onStockChange(subchoice);
          break;
        default:
          break;
      }
    }
  }
}
