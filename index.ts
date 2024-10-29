import { EventQueue } from './queue';
import { Event } from './types';
import { mockEvents } from './data/mock-data';
import { analyzeEvent } from './analysis/l1';
import { performL2Analysis, L2AnalysisResult } from './analysis/l2';

export const globalQueue = new EventQueue();

async function simulateEventStream() {
  console.log('Starting event simulation...');

  for (const event of mockEvents) {
    const delay = 1000 + Math.random() * 4000;
    await new Promise(resolve => setTimeout(resolve, delay));

    addToQueue(event);
    console.log(`Event added to queue: ${event.id} - ${event.symbol} (${event.type})`);
  }
}

export function addToQueue(event: Event) {
  globalQueue.enqueue(event);
}

async function main() {
  console.log('Starting market analysis system...\n');

  simulateEventStream().catch(console.error);

  while (true) {
    try {
      if (!globalQueue.isEmpty()) {
        const event = globalQueue.dequeue();
        if (event) {
          console.log(`\nProcessing event: ${event.id} - ${event.symbol}`);

          // L1 Analysis
          const l1Analysis = await analyzeEvent(event);
          console.log(`L1 Analysis complete for ${event.id}:`);
          console.log('Reason:', l1Analysis.reasoning);

          // L2 Analysis if required
          if (l1Analysis.requiresL2Analysis) {
            console.log(`\nPerforming L2 analysis for ${event.id}...`);
            const l2Analysis = await performL2Analysis(event);

            console.log('L2 Analysis results:');
            console.log('Analysis:', l2Analysis.analysis);
            console.log('Confidence:', l2Analysis.tradeConfidence);

            // L3 Handling (Trade Execution)
            if (l2Analysis.shouldTrade) {
              console.log('\nTrade opportunity identified!');
              console.log('Analysis:', l2Analysis.analysis);
              console.log('Confidence:', l2Analysis.tradeConfidence);
              console.log('Queuing for L3 execution... (not implemented yet)');
              // TODO: Implement L3 trade execution
              // await executeTradeStrategy(event, l2Analysis);
            } else {
              console.log('No trade opportunity identified.\n');
            }
          }
        }
      }

      await new Promise(resolve => setTimeout(resolve, 3000));

    } catch (error) {
      console.error('Error processing event:', error);
    }
  }
}

main().catch(console.error);