export interface Etf {
  symbol: string;
  name: string;
  currency: string;
  exchange: string;
  mic_code: string;
  country: string;
  type: string
}

export interface EtfList {
  data: Etf[];
}
