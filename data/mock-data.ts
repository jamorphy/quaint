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
      id: "evt_005",
      timestamp: "2024-10-28T14:31:30.000Z",
      type: "price_movement",
      symbol: "NVDA",
      priority: 1,
      data: {
        price: 875.00,
        price_previous: 850.00,
        percent_change: 2.94,
        time_span: 300
      }
    },
    {
      id: "evt_006",
      timestamp: "2024-10-28T14:31:45.000Z",
      type: "volume_spike",
      symbol: "NVDA",
      priority: 1,
      data: {
        volume: 5000000,        // Increased volume
        volume_avg: 800000,
        percent_above_avg: 525,  // Much higher spike
        timespan: 300
      }
    },
    {
      id: "evt_007",
      timestamp: "2024-10-28T14:31:50.000Z",
      type: "price_bar",
      symbol: "NVDA",
      priority: 1,
      data: {
        open: 875.00,
        high: 890.50,           // Strong bullish bar
        low: 874.80,
        close: 889.90,
        volume: 5000000,
        timestamp: "2024-10-28T14:31:50.000Z",
        vwap: 885.20
      }
    },
    {
      id: "evt_008",
      timestamp: "2024-10-28T14:31:55.000Z",
      type: "price_movement",
      symbol: "META",
      priority: 1,
      data: {
        price: 465.00,
        price_previous: 495.00,
        percent_change: -6.06,
        time_span: 300
      }
    },
    {
      id: "evt_009",
      timestamp: "2024-10-28T14:32:00.000Z",
      type: "volume_spike",
      symbol: "META",
      priority: 1,
      data: {
        volume: 8000000,
        volume_avg: 1200000,
        percent_above_avg: 567,
        timespan: 300
      }
    },
    {
      id: "evt_010",
      timestamp: "2024-10-28T14:32:05.000Z",
      type: "price_bar",
      symbol: "META",
      priority: 1,
      data: {
        open: 465.00,
        high: 465.20,
        low: 445.30,           // Sharp bearish bar
        close: 446.00,
        volume: 8000000,
        timestamp: "2024-10-28T14:32:05.000Z",
        vwap: 452.15
      }
    },
    {
      id: "evt_003",
      timestamp: "2024-10-28T14:32:30.000Z",
      type: "price_bar",
      symbol: "TSLA",
      priority: 3,
      data: {
        open: 242.50,
        high: 242.80,
        low: 235.20,
        close: 236.00,
        volume: 2500000,
        timestamp: "2024-10-28T14:32:30.000Z",
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