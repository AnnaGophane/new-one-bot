import { Telegraf } from 'telegraf';
import { BotContext, SessionData } from './types.js';
import { config } from './config.js';
import { logger } from './utils/logger.js';

export const initializeMiddleware = (bot: Telegraf<BotContext>) => {
  bot.use((ctx, next) => {
    if (!ctx.session) {
      ctx.session = {
        messageHistory: [],
        lastInteraction: Date.now(),
        totalRequests: 0,
        model: config.DEFAULT_MODEL,
        maxHistory: config.MAX_HISTORY_LENGTH
      } as SessionData;
    }

    ctx.session.lastInteraction = Date.now();
    ctx.isOwner = ctx.from?.id.toString() === config.OWNER_USER_ID;

    return next();
  });

  bot.use(async (ctx, next) => {
    const start = Date.now();
    const userId = ctx.from?.id;
    const username = ctx.from?.username || 'unknown';
    
    logger.info(`Received message from ${username} (${userId})`);
    
    await next();
    
    const ms = Date.now() - start;
    logger.info(`Response time: ${ms}ms for ${username} (${userId})`);
  });

  bot.use(async (ctx, next) => {
    if (ctx.isOwner) {
      return next();
    }

    const now = Date.now();
    const lastRequest = ctx.session.lastInteraction;
    
    if (now - lastRequest < 3000 && ctx.session.totalRequests > 0) {
      logger.warn(`Rate limit hit for user ${ctx.from?.id}`);
      await ctx.reply('Please wait a moment before sending another message.');
      return;
    }

    ctx.session.totalRequests += 1;
    return next();
  });
};
