export interface Stock {
  symbol: string;
  name: string;
  currency: string;
  exchange: string;
  country: string;
  type: string;
}

export interface StockList {
  data: Stock[];
}
