export interface AssetData {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export interface AssetDataResult {
  values: AssetData[];
}
