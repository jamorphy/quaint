import { getChatCompletion, getDecision } from '../models/openai';
import { Event, PriceEvent } from '../types';

export async function analyzeEvent(event: Event): Promise<{
  requiresL2Analysis: boolean;
  reasoning: string;
}> {
  const prompt = createPrompt(event);
  const analysis = await getChatCompletion(prompt);
  
  if (!analysis) {
    return {
      requiresL2Analysis: false,
      reasoning: "Analysis failed - no response received"
    };
  }

  return {
    requiresL2Analysis: analysis.toLowerCase().includes('investigate'),
    reasoning: analysis
  };
}

function createPrompt(event: Event): string {
  return `
    Analyze this market event and determine if it requires deeper investigation:
    Symbol: ${event.symbol}
    Event Type: ${event.type}
    Data: ${JSON.stringify(event.data)}

    Respond starting with either INVESTIGATE or IGNORE, followed by a brief reason.
    Example responses:
    "INVESTIGATE: Unusual price movement coupled with high volume"
    "IGNORE: Normal market fluctuation within expected range"
  `;
}