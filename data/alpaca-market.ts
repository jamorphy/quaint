import Alpaca from '@alpacahq/alpaca-trade-api';
import dotenv from 'dotenv';

dotenv.config();

const alpaca = new Alpaca({
  keyId: process.env.ALPACA_API_KEY!,
  secretKey: process.env.ALPACA_SECRET_KEY!,
  paper: true,
  feed: 'iex' // TODO: switch to SIP when upgrading account
});

export async function getDailyData(watchlist: string[]) {
  const end = new Date();
  end.setDate(end.getDate() - 1);
  const start = new Date(end);
  start.setDate(start.getDate() - 5);

  const options = {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
    timeframe: alpaca.newTimeframe(1, alpaca.timeframeUnit.DAY),
    feed: 'iex'
  };

  console.log('\n=== Daily Market Data ===');
  console.log('Fetching data from', options.start, 'to', options.end);

  const results = [];

  try {
    for (const symbol of watchlist) {
      const bars = await alpaca.getBarsV2(symbol, options);
      const data = [];
      for await (const bar of bars) {
        data.push(bar);
      }

      if (data && data.length > 0) {
        console.log(`\n${symbol} Last ${data.length} Trading Days:`);
        data.forEach(bar => {
          const date = new Date(bar.Timestamp).toLocaleDateString();
          console.log({
            date,
            open: bar.OpenPrice.toFixed(2),
            high: bar.HighPrice.toFixed(2),
            low: bar.LowPrice.toFixed(2),
            close: bar.ClosePrice.toFixed(2),
            volume: Math.round(bar.Volume).toLocaleString()
          });
        });
        results.push({ symbol, bars: data });
      }
    }
    return results;

  } catch (error) {
    console.error('Error fetching market data:', error);
    return [];
  }
}

export async function checkMarketSchedule() {
  try {
    const clock = await alpaca.getClock();
    console.log('\n=== Market Schedule ===');
    console.log({
      isOpen: clock.is_open,
      nextOpen: new Date(clock.next_open).toLocaleString(),
      nextClose: new Date(clock.next_close).toLocaleString(),
    });
    return clock.is_open;
  } catch (error) {
    console.error('Error checking market schedule:', error);
    return false;
  }
}

async function main() {
  console.log('Starting daily market data check...');
  await checkMarketSchedule();
  await getDailyData(['TSLA', 'META']);
}

if (require.main === module) {
  main()
    .then(() => console.log('\nDaily data check completed.'))
    .catch(console.error);
}