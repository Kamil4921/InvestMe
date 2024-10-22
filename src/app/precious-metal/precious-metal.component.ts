import { AfterViewInit, Component, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { AssetHelper } from '../Helpers/IAssetHelper';
import { SpeachToTextService } from '../Services/SpeachToText/speach-to-text.service';
import { select, Store } from '@ngrx/store';
import * as PreciousMetalActions from './../actions/precious-metal.actions';
import * as fromPreciousMetal from '../reducers/precious-metal.reducer';

@Component({
  selector: 'app-precious-metal',
  standalone: true,
  imports: [BaseChartDirective, MatOptionModule, MatFormFieldModule, MatSelectModule, CommonModule],
  templateUrl: './precious-metal.component.html',
  styleUrl: './precious-metal.component.scss'
})
export class PreciousMetalComponent implements AfterViewInit {
  selectedMetal = '';
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
  protected metalList: AssetHelper[] = [{name: "Złoto", symbol: "XAU/USD"}, {name: "Srebro", symbol: "XAG/USD"}];

  private speachService = inject(SpeachToTextService);
  private store = inject(Store);
  
  ngAfterViewInit(): void {
    this.speachService.recognition.addEventListener('result', (e:any) => {
      let last = e.results.length - 1;
      let command = e.results[last][0].transcript;
      this.handleCommand(command);
    });
  }
  
  protected onMetalChange(value: string): void {
    this.store.dispatch(PreciousMetalActions.loadPreciousMetalData({symbol: value}));
    this.store.pipe(select(fromPreciousMetal.selectPreciousMetalData)).subscribe(data => {
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
        case 'metal':
          this.selectedMetal = subchoice;
          this.onMetalChange(subchoice);
          break;
        default:
          break;
      }
    }
  }
}
