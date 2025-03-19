import * as fs from 'fs';

export interface TradeRecord {
  timestamp: string;
  symbol: string;
  direction: string;
  size: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  timeframe: string;
  riskLevel: string;
  reasoning: string;
}

// For easier testing
export const TRADE_HISTORY_FILE = 'trade-history.json';

// Initialize the trade history
function initTradeHistory(): TradeRecord[] {
  try {
    if (fs.existsSync(TRADE_HISTORY_FILE)) {
      const data = fs.readFileSync(TRADE_HISTORY_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading trade history:', error);
  }
  return [];
}

// Initialize the trade history array
let tradeHistory: TradeRecord[] = initTradeHistory();

export function logTrade(trade: Omit<TradeRecord, 'timestamp'>) {
  const record: TradeRecord = {
    ...trade,
    timestamp: new Date().toISOString(),
  };
  tradeHistory.push(record);
  
  try {
    fs.writeFileSync(TRADE_HISTORY_FILE, JSON.stringify(tradeHistory, null, 2));
  } catch (error) {
    console.error('Error writing trade history:', error);
  }
  
  return record;
}

export function getTradeHistory(): TradeRecord[] {
  return [...tradeHistory];
}

// For testing purposes
export function _resetTradeHistory(newHistory: TradeRecord[] = []) {
  tradeHistory = [...newHistory];
  return tradeHistory;
}