import { AfterViewInit, Component, inject } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { AssetHelper } from '../Helpers/IAssetHelper';
import { SpeachToTextService } from '../Services/SpeachToText/speach-to-text.service';
import { select, Store } from '@ngrx/store';
import * as CryptoActions from './../actions/crypto.actions';
import * as fromCrypto from '../reducers/crypto.reducer';

@Component({
  selector: 'app-crypto',
  standalone: true,
  imports: [BaseChartDirective, MatOptionModule, MatFormFieldModule, MatSelectModule, CommonModule],
  templateUrl: './crypto.component.html',
  styleUrl: './crypto.component.scss'
})
export class CryptoComponent implements AfterViewInit {
  protected selectedCrypto = '';

  protected isVisible: boolean = false;

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

  protected cryptoList: AssetHelper[] = [{name: "Bitcoin", symbol: "BTC/USD"}, {name: "Etherium", symbol: "ETH/USD"}];

  private store = inject(Store);
  private speachService = inject(SpeachToTextService);

  ngAfterViewInit(): void {
    this.speachService.recognition.addEventListener('result', (e: any) => {
      let last = e.results.length - 1;
      let command = e.results[last][0].transcript;
      this.handleCommand(command);
    });
  }

  protected onCryptoChange(value: string): void {
    this.store.dispatch(CryptoActions.loadCryptoData({ symbol: value }));
    this.store.pipe(select(fromCrypto.selectCryptoData)).subscribe(data => {
      if(data){
        const chartData = data.map((v:any) => parseFloat(v.close));
        const chartLabels = data.map((t:any) => t.datetime);

        this.lineChartData = [{ data: chartData.reverse() }];
        this.lineChartLabels = chartLabels.reverse();
      }
    });

    this.isVisible = true;
  }

  private handleCommand(command: string): void {
    let words = command.split(' ');

    if (words[0].toLowerCase() === 'wybierz' || words[0].toLowerCase() === 'wybrać') {
      let choice = words.slice(1,2).join(' ').toLowerCase();
      let subchoice = words.slice(2).join(' ').toUpperCase();

      switch(choice) {
        case 'krypto':
          this.selectedCrypto = subchoice;
          this.onCryptoChange(subchoice);
          break;
        case 'crypto':
          this.selectedCrypto = subchoice;
          this.onCryptoChange(subchoice);
          break;
        default:
          break;
      }
    }
  }
}
