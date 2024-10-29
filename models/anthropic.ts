import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function getChatCompletion(
  prompt: string,
  model: string = 'claude-3-opus-latest',
  temperature: number = 0.3
) {
  try {
    const response = await anthropic.messages.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: 1024,
    });

    return response.content[0].type === 'text' ? response.content[0].text : null;
  } catch (error) {
    console.error('Anthropic API Error:', error);
    throw error;
  }
}

export async function getDecision(
  prompt: string,
  model: string = 'claude-3-opus-latest'
): Promise<boolean> {
  const response = await getChatCompletion(
    prompt + "\nRespond with only 'YES' or 'NO'.",
    model,
    0.1  // Lower temperature for more consistent yes/no
  );
  
  return response?.toLowerCase().includes('yes') ?? false;
}