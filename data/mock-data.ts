import { Event } from '../types';

export const mockEvents: Event[] = [
    {
      id: "evt_001",
      timestamp: "2024-10-28T14:30:00.000Z",
      type: "price_movement",
      symbol: "AAPL",
      priority: 1,
      data: {
        price: 168.50,
        price_previous: 175.00,
        percent_change: -3.71,
        time_span: 300          // 5 minutes
      }
    },
    {
      id: "evt_002",
      timestamp: "2024-10-28T14:31:00.000Z",
      type: "volume_spike",
      symbol: "AAPL",
      priority: 2,
      data: {
        volume: 1500000,
        volume_avg: 500000,
        percent_above_avg: 200,
        timespan: 300
      }
    },
    {
      id: "evt_003",
      timestamp: "2024-10-28T14:32:00.000Z",
      type: "price_bar",
      symbol: "TSLA",
      priority: 3,
      data: {
        open: 242.50,
        high: 242.80,
        low: 235.20,
        close: 236.00,
        volume: 2500000,
        timestamp: "2024-10-28T14:32:00.000Z",
        vwap: 238.65
      }
    },
    {
      id: "evt_004",
      timestamp: "2024-10-28T14:33:00.000Z",
      type: "price_movement",
      symbol: "MSFT",
      priority: 1,
      data: {
        price: 338.50,
        price_previous: 342.00,
        percent_change: -1.02,
        time_span: 180          // 3 minutes
      }
    }
  ];