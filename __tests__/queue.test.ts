import { EventQueue } from '../queue';
import { Event } from '../types';

describe('EventQueue', () => {
  let queue: EventQueue;

  beforeEach(() => {
    queue = new EventQueue();
  });

  test('should enqueue and dequeue events', () => {
    const event: Event = {
      id: 'test-1',
      type: 'price_bar',
      symbol: 'TSLA',
      timestamp: '123456',
      priority: 0,
      data: { timestamp: '123456', open: 100, high: 105, low: 95, close: 102, volume: 1000 },
    };
    queue.enqueue(event);
    expect(queue.size()).toBe(1);
    expect(queue.dequeue()).toEqual(event);
    expect(queue.size()).toBe(0);
  });

  test('should sort by priority', () => {
    const event1: Event = { id: 'test-1', type: 'price_bar', symbol: 'TSLA', timestamp: '123456', priority: 1, data: { timestamp: '123456', open: 100, high: 105, low: 95, close: 102, volume: 1000 } };
    const event2: Event = { id: 'test-2', type: 'price_bar', symbol: 'META', timestamp: '123457', priority: 0, data: { timestamp: '123457', open: 200, high: 205, low: 195, close: 202, volume: 2000 } };
    queue.enqueue(event1);
    queue.enqueue(event2);
    expect(queue.dequeue()).toEqual(event2); // Lower priority first
  });

  test('should return null when dequeue on empty queue', () => {
    expect(queue.dequeue()).toBeNull();
  });

  test('should correctly report if queue is empty', () => {
    expect(queue.isEmpty()).toBe(true);
    
    const event: Event = {
      id: 'test-1',
      type: 'price_bar',
      symbol: 'TSLA',
      timestamp: '123456',
      priority: 0,
      data: { timestamp: '123456', open: 100, high: 105, low: 95, close: 102, volume: 1000 },
    };
    queue.enqueue(event);
    
    expect(queue.isEmpty()).toBe(false);
  });

  test('should peek at the first event without removing it', () => {
    const event: Event = {
      id: 'test-1',
      type: 'price_bar',
      symbol: 'TSLA',
      timestamp: '123456',
      priority: 0,
      data: { timestamp: '123456', open: 100, high: 105, low: 95, close: 102, volume: 1000 },
    };
    queue.enqueue(event);
    
    expect(queue.peek()).toEqual(event);
    expect(queue.size()).toBe(1); // Size remains unchanged after peek
  });

  test('should return a snapshot of the queue', () => {
    const event1: Event = { id: 'test-1', type: 'price_bar', symbol: 'TSLA', timestamp: '123456', priority: 0, data: { timestamp: '123456', open: 100, high: 105, low: 95, close: 102, volume: 1000 } };
    const event2: Event = { id: 'test-2', type: 'price_bar', symbol: 'META', timestamp: '123457', priority: 1, data: { timestamp: '123457', open: 200, high: 205, low: 195, close: 202, volume: 2000 } };
    
    queue.enqueue(event1);
    queue.enqueue(event2);
    
    const snapshot = queue.getSnapshot();
    expect(snapshot).toEqual([event1, event2]);
    expect(snapshot).not.toBe(queue.getSnapshot()); // Should be a new array
  });
});