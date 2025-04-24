import OpenAI from 'openai';
import { ChatMessage } from '../types.js';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY
});

export const processWithAI = async (
  messageHistory: ChatMessage[],
  model: string
): Promise<string> => {
  try {
    const messages = [
      {
        role: 'system',
        content: 'You are an advanced AI assistant in a Telegram bot. Provide helpful, accurate, and concise responses. When formatting your responses, use Markdown syntax supported by Telegram (bold, italic, code blocks).'
      },
      ...messageHistory
    ];
    
    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages.map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content
      })),
      temperature: 0.7,
      max_tokens: 2000
    });
    
    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    
    return response;
  } catch (error) {
    logger.error('Error in AI processing:', error);
    throw new Error('Failed to process with AI service');
  }
};
