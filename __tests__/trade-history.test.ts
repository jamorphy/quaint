import * as fs from 'fs';
import { logTrade, getTradeHistory, _resetTradeHistory, TradeRecord, TRADE_HISTORY_FILE } from '../trade-history';

// Mock fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

describe('Trade History', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    _resetTradeHistory([]); // Reset the internal trade history array
  });

  test('should log a trade', () => {
    const trade = {
      symbol: 'TSLA',
      direction: 'buy',
      size: 10,
      entryPrice: 250.5,
      stopLoss: 240,
      takeProfit: 270,
      timeframe: 'daily',
      riskLevel: 'medium',
      reasoning: 'Technical breakout pattern',
    };

    const result = logTrade(trade);

    // Verify trade was logged internally
    const history = getTradeHistory();
    expect(history).toHaveLength(1);
    expect(history[0]).toEqual(result);
    expect(history[0].symbol).toEqual('TSLA');
    expect(history[0].timestamp).toBeDefined();

    // Check that writeFileSync was called
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      TRADE_HISTORY_FILE,
      expect.any(String)
    );
  });

  test('should append trades to existing history', () => {
    // Set up initial history
    const existingTrade: TradeRecord = {
      timestamp: '2023-01-01T12:00:00.000Z',
      symbol: 'AAPL',
      direction: 'sell',
      size: 5,
      entryPrice: 180.5,
      stopLoss: 190,
      takeProfit: 170,
      timeframe: 'hourly',
      riskLevel: 'low',
      reasoning: 'Overbought conditions',
    };
    _resetTradeHistory([existingTrade]);

    // Add a new trade
    const newTrade = {
      symbol: 'META',
      direction: 'buy',
      size: 15,
      entryPrice: 320,
      stopLoss: 300,
      takeProfit: 350,
      timeframe: 'daily',
      riskLevel: 'high',
      reasoning: 'Strong earnings report',
    };

    logTrade(newTrade);

    // Verify both trades are in history
    const history = getTradeHistory();
    expect(history).toHaveLength(2);
    expect(history[0]).toEqual(existingTrade);
    expect(history[1].symbol).toEqual('META');

    // Check correct data was written to file
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    const writtenData = JSON.parse((fs.writeFileSync as jest.Mock).mock.calls[0][1]);
    expect(writtenData).toEqual(history);
  });

  test('should return a copy of trade history', () => {
    const mockHistory: TradeRecord[] = [
      {
        timestamp: '2023-01-01T12:00:00.000Z',
        symbol: 'AAPL',
        direction: 'sell',
        size: 5,
        entryPrice: 180.5,
        stopLoss: 190,
        takeProfit: 170,
        timeframe: 'hourly',
        riskLevel: 'low',
        reasoning: 'Overbought conditions',
      },
    ];

    _resetTradeHistory(mockHistory);
    
    const history = getTradeHistory();
    
    // Should match the mock data
    expect(history).toEqual(mockHistory);
    
    // Should be a copy, not the original reference
    expect(history).not.toBe(mockHistory);
    
    // Modifying the returned copy should not affect the internal state
    history.push({
      timestamp: 'new-timestamp',
      symbol: 'TEST',
      direction: 'buy',
      size: 1,
      entryPrice: 100,
      stopLoss: 90,
      takeProfit: 110,
      timeframe: 'daily',
      riskLevel: 'low',
      reasoning: 'Test',
    });
    
    expect(getTradeHistory()).toHaveLength(1); // Original length
  });
});