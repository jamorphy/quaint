type EventType = 'price_movement' | 'volume_spike' | 'price_bar';

export interface Event {
  id: string;                // Unique event identifier
  timestamp: string;         // ISO timestamp
  type: EventType;          
  symbol: string;           // ticker
  priority: number;
  data: PriceEvent | VolumeEvent | BarData;
}

export interface PriceEvent {
  price: number;
  price_previous: number;
  percent_change: number;
  time_span: number;        // seconds over which change occurred
}

export interface VolumeEvent {
  volume: number;
  volume_avg: number;       // Average volume for comparison
  percent_above_avg: number;
  timespan: number;         // period in seconds
}

export interface BarData {         // Similar to Alpaca's bar data
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: string;
  vwap?: number;           // Volume Weighted Average Price
}