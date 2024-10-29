import { EventQueue } from './queue';
import { Event } from './types';
import { mockEvents } from './data/mock-data';
import { analyzeEvent } from './analysis/l1';
import { performL2Analysis, L2AnalysisResult } from './analysis/l2';
import { makeTradeDecision } from './analysis/l3';

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

async function main() {
  logSeparator('MARKET ANALYSIS SYSTEM STARTING');
  console.log('Initializing event stream...\n');

  simulateEventStream().catch(console.error);

  while (true) {
    try {
      if (!globalQueue.isEmpty()) {
        const event = globalQueue.dequeue();
        if (event) {
          logSeparator(`NEW EVENT: ${event.id} - ${event.symbol} (${event.type})`);
          console.log('Timestamp:', event.timestamp);
          console.log('Data:', JSON.stringify(event.data, null, 2));

          // L1 Analysis
          logSubsection('LEVEL 1 ANALYSIS');
          const l1Analysis = await analyzeEvent(event);
          console.log('Result:', l1Analysis.reasoning);
          console.log('Requires L2:', l1Analysis.requiresL2Analysis ? 'YES' : 'NO');

          // L2 Analysis if required
          if (l1Analysis.requiresL2Analysis) {
            logSubsection('LEVEL 2 ANALYSIS');
            const l2Analysis = await performL2Analysis(event);

            console.log('Trade Potential:', l2Analysis.shouldTrade ? 'YES' : 'NO');
            console.log('Confidence Score:', l2Analysis.tradeConfidence);
            console.log('\nDetailed Analysis:');
            console.log(l2Analysis.analysis);

            // L3 Analysis if L2 approves
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

async function simulateEventStream() {
  logSeparator('EVENT SIMULATION STARTING');

  for (const event of mockEvents) {
    const delay = 1000 + Math.random() * 4000;
    await new Promise(resolve => setTimeout(resolve, delay));

    addToQueue(event);
    console.log(`Added to queue: ${event.id} - ${event.symbol} (${event.type})`);
  }
}

export function addToQueue(event: Event) {
  globalQueue.enqueue(event);
}

main().catch(console.error);