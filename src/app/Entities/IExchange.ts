export interface Exchange {
  name: string;
  code: string;
  country: string;
  timezone: string;
}

export interface ExchangeResult {
  data: Exchange[];
}
