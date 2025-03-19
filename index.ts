import { EventQueue } from './queue';
import { Event } from './types';
import { mockEvents } from './data/mock-data';
import { analyzeEvent } from './analysis/l1';
import { performL2Analysis, L2AnalysisResult } from './analysis/l2';
import { makeTradeDecision } from './analysis/l3';
import { getDailyData, checkMarketSchedule } from './data/alpaca-market';
import { WATCHLIST } from './watchlist';
import { logTrade } from './trade-history';

export const globalQueue = new EventQueue();

function logSeparator(text: string) {
  console.log('\n' + '='.repeat(80));
  console.log(`${text}`);
  console.log('='.repeat(80));
}

function logSubsection(text: string) {
  console.log('\n' + '-'.repeat(40));
  console.log(text);
  console.log('-'.repeat(40));
}

async function fetchMarketData() {
  logSeparator('FETCHING MARKET DATA');
  const isMarketOpen = await checkMarketSchedule();
  if (!isMarketOpen) {
    console.log('Market is closed. Skipping data fetch.');
    return;
  }
  const dailyData = await getDailyData(WATCHLIST);
  dailyData.forEach(({ symbol, bars }) => {
    bars.forEach(bar => {
      const event: Event = {
        id: `${symbol}-${bar.Timestamp}`,
        type: 'price_bar',
        symbol,
        timestamp: new Date(bar.Timestamp).getTime().toString(),
        priority: 0,
        data: {
          timestamp: new Date(bar.Timestamp).getTime().toString(),
          open: bar.OpenPrice,
          high: bar.HighPrice,
          low: bar.LowPrice,
          close: bar.ClosePrice,
          volume: bar.Volume
        }
      };
      addToQueue(event);
    });
  });
}

async function processEvents() {
  while (true) {
    try {
      if (!globalQueue.isEmpty()) {
        const event = globalQueue.dequeue();
        if (event) {
          logSeparator(`NEW EVENT: ${event.id} - ${event.symbol} (${event.type})`);
          console.log('Timestamp:', event.timestamp);
          console.log('Data:', JSON.stringify(event.data, null, 2));

          logSubsection('LEVEL 1 ANALYSIS');
          const l1Analysis = await analyzeEvent(event);
          console.log('Result:', l1Analysis.reasoning);
          console.log('Requires L2:', l1Analysis.requiresL2Analysis ? 'YES' : 'NO');

          if (l1Analysis.requiresL2Analysis) {
            logSubsection('LEVEL 2 ANALYSIS');
            const l2Analysis = await performL2Analysis(event);

            console.log('Trade Potential:', l2Analysis.shouldTrade ? 'YES' : 'NO');
            console.log('Confidence Score:', l2Analysis.tradeConfidence);
            console.log('\nDetailed Analysis:');
            console.log(l2Analysis.analysis);

            if (l2Analysis.shouldTrade) {
              logSubsection('LEVEL 3 ANALYSIS');
              const tradeDecision = await makeTradeDecision(event, l2Analysis);

              if (tradeDecision.executeOrder) {
                logSubsection('TRADE EXECUTION APPROVED');
                console.log(`Direction:     ${tradeDecision.direction.toUpperCase()}`);
                console.log(`Position Size: ${tradeDecision.size}%`);
                console.log(`Entry Price:   ${tradeDecision.entryPrice}`);
                console.log(`Stop Loss:     ${tradeDecision.stopLoss}`);
                console.log(`Take Profit:   ${tradeDecision.takeProfit}`);
                console.log(`Timeframe:     ${tradeDecision.timeframe}`);
                console.log(`Risk Level:    ${tradeDecision.riskLevel.toUpperCase()}`);
                console.log('\nReasoning:');
                console.log(tradeDecision.reasoning);

                // Log the trade to history
                logTrade({
                  symbol: event.symbol,
                  direction: tradeDecision.direction,
                  size: tradeDecision.size,
                  entryPrice: tradeDecision.entryPrice,
                  stopLoss: tradeDecision.stopLoss,
                  takeProfit: tradeDecision.takeProfit,
                  timeframe: tradeDecision.timeframe,
                  riskLevel: tradeDecision.riskLevel,
                  reasoning: tradeDecision.reasoning,
                });

                logSubsection('SENDING TO ORDER EXECUTION');
                // TODO: Send to order execution system
              } else {
                logSubsection('TRADE EXECUTION REJECTED');
                console.log('Reason:', tradeDecision.reasoning);
              }
            } else {
              console.log('\nNo trade opportunity identified.');
            }
          }

          console.log('\n' + '-'.repeat(80) + '\n');
        }
      }

      await new Promise(resolve => setTimeout(resolve, 3000));

    } catch (error) {
      logSeparator('ERROR');
      console.error('Error processing event:', error);
    }
  }
}

async function main() {
  logSeparator('MARKET ANALYSIS SYSTEM STARTING');

  // Initial market data fetch
  await fetchMarketData();

  // Start hourly market checks
  setInterval(fetchMarketData, 60 * 60 * 1000); // Every hour

  // Start event processing loop
  await processEvents();
}

export function addToQueue(event: Event) {
  globalQueue.enqueue(event);
}

main().catch(console.error);