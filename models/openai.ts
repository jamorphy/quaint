import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getChatCompletion(
  prompt: string,
  model: string = 'gpt-4o-mini',
  temperature: number = 0.3
) {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}

export async function getDecision(
  prompt: string,
  model: string = 'gpt-4o-mini'
): Promise<boolean> {
  const response = await getChatCompletion(
    prompt + "\nRespond with only 'YES' or 'NO'.",
    model,
    0.1  // Lower temperature for more consistent yes/no
  );
  
  return response?.toLowerCase().includes('yes') ?? false;
}