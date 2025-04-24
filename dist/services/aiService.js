import OpenAI from 'openai';
import { config } from '../config';
import { logger } from '../utils/logger';
// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: config.OPENAI_API_KEY
});
// Process message with AI
export const processWithAI = async (messageHistory, model) => {
    try {
        // Prepare messages for OpenAI
        const messages = [
            {
                role: 'system',
                content: 'You are an advanced AI assistant in a Telegram bot. Provide helpful, accurate, and concise responses. When formatting your responses, use Markdown syntax supported by Telegram (bold, italic, code blocks).'
            },
            ...messageHistory
        ];
        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: model,
            messages: messages.map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            temperature: 0.7,
            max_tokens: 2000
        });
        // Extract and return response
        const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
        return response;
    }
    catch (error) {
        logger.error('Error in AI processing:', error);
        throw new Error('Failed to process with AI service');
    }
};
