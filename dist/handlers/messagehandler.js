import { processWithAI } from '../services/aiService';
import { logger } from '../utils/logger';
// Handle incoming messages
export const handleMessage = async (ctx) => {
    try {
        // Skip processing for empty messages
        if (!ctx.message.text) {
            return;
        }
        // Show typing indicator
        await ctx.sendChatAction('typing');
        // Add user message to history
        ctx.session.messageHistory.push({
            role: 'user',
            content: ctx.message.text
        });
        // Trim history if it exceeds the maximum length
        if (ctx.session.messageHistory.length > ctx.session.messageHistory.length) {
            ctx.session.messageHistory = ctx.session.messageHistory.slice(-ctx.session.messageHistory.length);
        }
        // Process message with AI
        const response = await processWithAI(ctx.session.messageHistory, ctx.session.model);
        // Add AI response to history
        ctx.session.messageHistory.push({
            role: 'assistant',
            content: response
        });
        // Send response
        await ctx.reply(response, { parse_mode: 'Markdown' });
    }
    catch (error) {
        logger.error('Error handling message:', error);
        await ctx.reply('Sorry, I encountered an error processing your message. Please try again later.');
    }
};
