import { BotContext } from '../types.js';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

export const userCommandsHandler = {
  start: async (ctx: BotContext) => {
    const message = `
*Welcome to Advanced AI Assistant!* 🤖

I'm a bot powered by advanced AI technology, providing premium features for free.

*How to use me:*
• Simply send me a message and I'll respond with AI-generated content
• Use /help to see all available commands
• Your conversation history is saved for context

Type something to get started!
    `;
    
    await ctx.reply(message, { parse_mode: 'Markdown' });
    logger.info(`User ${ctx.from?.id} started the bot`);
  },
  
  help: async (ctx: BotContext) => {
    const message = `
*Available Commands:*

/start - Start the bot
/help - Show this help message
/clear - Clear your conversation history
/model - Show current AI model
/settings - Adjust your settings

*How to use:*
Simply send me a message, and I'll respond using advanced AI technology.

*Features:*
• Contextual responses that remember your conversation
• Advanced AI capabilities
• Free access to premium features
• Support for text, images, and voice
    `;
    
    await ctx.reply(message, { parse_mode: 'Markdown' });
  },
  
  clearHistory: async (ctx: BotContext) => {
    ctx.session.messageHistory = [];
    await ctx.reply('✅ Your conversation history has been cleared.');
    logger.info(`User ${ctx.from?.id} cleared their history`);
  },
  
  showModel: async (ctx: BotContext) => {
    const modelInfo = ctx.session.model === config.PREMIUM_MODEL 
      ? `*Current model:* ${ctx.session.model} (Premium)`
      : `*Current model:* ${ctx.session.model}`;
      
    await ctx.reply(modelInfo, { parse_mode: 'Markdown' });
  },
  
  showSettings: async (ctx: BotContext) => {
    const settings = `
*Your Settings:*

*AI Model:* ${ctx.session.model}
*History Length:* ${config.MAX_HISTORY_LENGTH} messages
*Total Requests:* ${ctx.session.totalRequests}

To change your model, contact the bot owner.
    `;
    
    await ctx.reply(settings, { parse_mode: 'Markdown' });
  }
};
