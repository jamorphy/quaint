import { WATCHLIST } from '../watchlist';

describe('Watchlist', () => {
  test('should contain expected tickers', () => {
    expect(WATCHLIST).toEqual(['TSLA', 'META', 'SPY', 'AAPL', 'MSFT']);
  });

  test('should be an array', () => {
    expect(Array.isArray(WATCHLIST)).toBe(true);
  });
});