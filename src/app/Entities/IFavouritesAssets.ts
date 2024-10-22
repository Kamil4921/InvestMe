import { Etf } from './IEtf';
import { Stock } from './IStock';

export interface FavouritesAssets{
    stocks: Array<Stock>;
    etfs: Array<Etf>;
}