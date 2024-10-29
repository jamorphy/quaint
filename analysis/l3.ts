import { getChatCompletion } from '../models/openai';
import { Event } from '../types';
import { L2AnalysisResult } from './l2';

export interface TradeDecision {
  executeOrder: boolean;
  direction: 'long' | 'short';
  size: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  timeframe: string;
  reasoning: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export async function makeTradeDecision(
  event: Event,
  l2Result: L2AnalysisResult
): Promise<TradeDecision> {
  const prompt = createExecutionPrompt(event, l2Result);
  const analysis = await getChatCompletion(prompt);

  if (!analysis) {
    return createDefaultResponse("Analysis failed - no response received");
  }

  try {
    const lines = analysis.split('\n').map(line => line.trim());
    const execute = lines[0].toLowerCase().startsWith('execute');

    if (!execute) {
      return createDefaultResponse(lines.join('\n'));
    }

    // TODO: improve robustness
    const direction = lines.find(l => l.startsWith('DIRECTION:'))?.split(':')[1].trim().toLowerCase() as 'long' | 'short';
    const size = parseFloat(lines.find(l => l.startsWith('SIZE:'))?.split(':')[1] || '0');
    const entryPrice = parseFloat(lines.find(l => l.startsWith('ENTRY:'))?.split(':')[1] || '0');
    const stopLoss = parseFloat(lines.find(l => l.startsWith('STOP:'))?.split(':')[1] || '0');
    const takeProfit = parseFloat(lines.find(l => l.startsWith('TARGET:'))?.split(':')[1] || '0');
    const timeframe = lines.find(l => l.startsWith('TIMEFRAME:'))?.split(':')[1].trim() || '';
    const riskLevel = lines.find(l => l.startsWith('RISK:'))?.split(':')[1].trim().toLowerCase() as 'low' | 'medium' | 'high';

    const reasoningStart = lines.findIndex(l => l.startsWith('REASONING:'));
    const reasoning = reasoningStart !== -1 ?
      lines.slice(reasoningStart + 1).join('\n') :
      'No detailed reasoning provided';

    return {
      executeOrder: true,
      direction,
      size,
      entryPrice,
      stopLoss,
      takeProfit,
      timeframe,
      riskLevel,
      reasoning
    };
  } catch (error) {
    return createDefaultResponse("Failed to parse trade decision");
  }
}

function createExecutionPrompt(event: Event, l2Result: L2AnalysisResult): string {
  return `
    Make final trade execution decision based on this pre-approved trading opportunity:

    Symbol: ${event.symbol}
    Event Type: ${event.type}
    Data: ${JSON.stringify(event.data)}
    L2 Analysis: ${l2Result.analysis}
    L2 Confidence: ${l2Result.tradeConfidence}

    Current market conditions and risk parameters must be considered.
    Provide a structured response with specific trade parameters.

    Start with either:
    "EXECUTE: <brief reason>" if trade should proceed
    "REJECT: <brief reason>" if trade should be rejected

    If executing, include these parameters (one per line):
    DIRECTION: LONG or SHORT
    SIZE: <number 1-100> (percentage of available capital)
    ENTRY: <price>
    STOP: <stop loss price>
    TARGET: <take profit price>
    TIMEFRAME: <expected hold duration>
    RISK: LOW, MEDIUM, or HIGH
    REASONING: <detailed multi-line analysis>

    Example response:
    "EXECUTE: Strong technical setup with clear risk parameters
    DIRECTION: LONG
    SIZE: 25
    ENTRY: 150.50
    STOP: 148.00
    TARGET: 156.00
    TIMEFRAME: 2-3 days
    RISK: MEDIUM
    REASONING:
    - Multiple technical indicators showing bullish convergence
    - Clear support level established at stop loss point
    - Risk-reward ratio of 1:3 meets our criteria
    - Volume profile supports upward movement"
  `;
}

function createDefaultResponse(reason: string): TradeDecision {
  return {
    executeOrder: false,
    direction: 'long',
    size: 0,
    entryPrice: 0,
    stopLoss: 0,
    takeProfit: 0,
    timeframe: '',
    riskLevel: 'low',
    reasoning: reason
  };
}