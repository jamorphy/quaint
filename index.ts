import { EventQueue } from './queue';
import { Event } from './types';
import { mockEvents } from './data/mock-data';
import { analyzeEvent } from './analysis/l1';

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

          const analysis = await analyzeEvent(event);

          if (analysis.requiresL2Analysis) {
            console.log(`Event ${event.id} requires L2 analysis:`);
            console.log('Reason:', analysis.reasoning);
            console.log('Queuing for L2... (not implemented yet)\n');
          } else {
            console.log(`Event ${event.id} processed by L1 only:`);
            console.log('Reason:', analysis.reasoning, '\n');
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