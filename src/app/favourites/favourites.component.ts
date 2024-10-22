import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Asset } from '../Entities/IAsset';
import { FavouritesAssets } from '../Entities/IFavouritesAssets';
import { Etf } from '../Entities/IEtf';
import { Stock } from '../Entities/IStock';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.scss'
})
export class FavouritesComponent implements OnInit {
  protected favourities$: BehaviorSubject<FavouritesAssets> = new BehaviorSubject<FavouritesAssets>({} as FavouritesAssets);
  protected stocks$: BehaviorSubject<Stock[]> = new BehaviorSubject<Stock[]>([]);
  protected etfs$: BehaviorSubject<Etf[]> = new BehaviorSubject<Etf[]>([]);

  private STORAGE_KEY = 'favouriteAssets';

  ngOnInit(): void {
    this.loadFavourities();

    this.favourities$.subscribe(f => {
      this.stocks$.next(f.stocks);
      this.etfs$.next(f.etfs);
    })
  }

  protected Remove(asset: Stock | Etf): void {
    let favourities: FavouritesAssets = {...this.favourities$.getValue()};

    if(asset.type === "Common Stock"){
      let index = favourities.stocks.findIndex(a => a === asset);
      favourities.stocks.splice(index, 1);
    }
    else {
      let index = favourities.etfs.findIndex((a) => a === asset);
      favourities.etfs.splice(index, 1);
    }
    
    this.favourities$.next(favourities);
    this.saveFavourities(favourities);
  }

  private saveFavourities(assets: FavouritesAssets): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(assets));
  }

  private loadFavourities(): void {
    const favourities = localStorage.getItem(this.STORAGE_KEY);
    if (favourities) {
      this.favourities$.next(JSON.parse(favourities) as FavouritesAssets);
    }
  }
}
