import { Telegraf } from 'telegraf';
import { BotContext, SessionData } from './types';
import { config } from './config';
import { logger } from './utils/logger';

// Initialize middleware for the bot
export const initializeMiddleware = (bot: Telegraf<BotContext>) => {
  // Session initialization middleware
  bot.use((ctx, next) => {
    // Initialize session if it doesn't exist
    if (!ctx.session) {
      ctx.session = {
        messageHistory: [],
        lastInteraction: Date.now(),
        totalRequests: 0,
        model: config.DEFAULT_MODEL
      } as SessionData;
    }

    // Update last interaction time
    ctx.session.lastInteraction = Date.now();

    // Check if user is owner
    ctx.isOwner = ctx.from?.id.toString() === config.OWNER_USER_ID;

    return next();
  });

  // Logging middleware
  bot.use(async (ctx, next) => {
    const start = Date.now();
    const userId = ctx.from?.id;
    const username = ctx.from?.username || 'unknown';
    
    logger.info(`Received message from ${username} (${userId})`);
    
    await next();
    
    const ms = Date.now() - start;
    logger.info(`Response time: ${ms}ms for ${username} (${userId})`);
  });

  // Rate limiting middleware
  bot.use(async (ctx, next) => {
    // Skip rate limiting for owner
    if (ctx.isOwner) {
      return next();
    }

    // Implement simple rate limiting (can be replaced with more sophisticated solution)
    const now = Date.now();
    const lastRequest = ctx.session.lastInteraction;
    
    // Rate limit: no more than 1 request per 3 seconds
    if (now - lastRequest < 3000 && ctx.session.totalRequests > 0) {
      logger.warn(`Rate limit hit for user ${ctx.from?.id}`);
      await ctx.reply('Please wait a moment before sending another message.');
      return;
    }

    ctx.session.totalRequests += 1;
    return next();
  });
};
