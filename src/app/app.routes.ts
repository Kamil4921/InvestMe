import { Routes } from '@angular/router';
import { StockComponent } from './stock/stock.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EtfComponent } from './etf/etf.component';
import { CryptoComponent } from './crypto/crypto.component';
import { PreciousMetalComponent } from './precious-metal/precious-metal.component';
import { FavouritesComponent } from './favourites/favourites.component';

export const routes: Routes = [
    {path:'', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: DashboardComponent},
    {path: 'stock', component: StockComponent},
    {path: 'etf', component: EtfComponent},
    {path: 'crypto', component: CryptoComponent},
    {path: 'metal', component: PreciousMetalComponent},
    {path: 'favourites', component: FavouritesComponent}
];
