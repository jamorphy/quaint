import { Event } from './types';

export class EventQueue {
    private queue: Event[] = [];
    private isProcessing: boolean = false;
    
    enqueue(event: Event): void {
      this.queue.push(event);
      this.queue.sort((a, b) => a.priority - b.priority);
    }
  
    dequeue(): Event | null {
      return this.queue.shift() || null;
    }
  
    peek(): Event | null {
      return this.queue[0] || null;
    }
  
    isEmpty(): boolean {
      return this.queue.length === 0;
    }
  
    size(): number {
      return this.queue.length;
    }
  
    getSnapshot(): Event[] {
      return [...this.queue];
    }
}