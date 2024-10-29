import { getChatCompletion } from '../models/openai';
import { Event, PriceEvent } from '../types';

export interface L2AnalysisResult {
  shouldTrade: boolean;
  tradeConfidence: number;
  analysis: string;
}

export async function performL2Analysis(event: Event): Promise<L2AnalysisResult> {
  const prompt = createTradingPrompt(event);
  const analysis = await getChatCompletion(prompt);

  if (!analysis) {
    return {
      shouldTrade: false,
      tradeConfidence: 0,
      analysis: "Analysis failed - no response received"
    };
  }

  // Parse the text response
  const lines = analysis.split('\n').map(line => line.trim());
  const shouldTrade = lines[0].toLowerCase().startsWith('trade');
  const confidence = shouldTrade ? 0.8 : 0;

  return {
    shouldTrade,
    tradeConfidence: confidence,
    analysis: lines.slice(1).join('\n').trim()
  };
}

function createTradingPrompt(event: Event): string {
  return `
    Analyze this flagged market event for potential trading opportunities:
    Symbol: ${event.symbol}
    Event Type: ${event.type}
    Data: ${JSON.stringify(event.data)}

    Evaluate if this event warrants trade consideration.
    Respond with either:
    "TRADE: <reason>" if the event shows strong potential
    "PASS: <reason>" if the event should be ignored

    Example responses:
    "TRADE: Multiple technical indicators align with strong volume support
    Further analysis shows breakout confirmation with institutional buying..."

    "PASS: Insufficient market signals
    While volume is elevated, price action remains within normal range..."
  `;
}