import { Telegraf, session } from 'telegraf';
import { message } from 'telegraf/filters';
import { config } from './config.js';
import { setupCommands } from './commands.js';
import { handleMessage } from './handlers/messageHandler.js';
import { BotContext } from './types.js';
import { initializeMiddleware } from './middleware.js';
import { logger } from './utils/logger.js';

// Initialize the bot
const bot = new Telegraf<BotContext>(config.TELEGRAM_BOT_TOKEN);

// Set up session middleware
bot.use(session());

// Initialize custom middleware
initializeMiddleware(bot);

// Set up commands
setupCommands(bot);

// Handle text messages
bot.on(message('text'), (ctx) => handleMessage(ctx));

// Handle voice messages
bot.on(message('voice'), (ctx) => handleMessage(ctx));

// Handle image messages
bot.on(message('photo'), (ctx) => handleMessage(ctx));

// Add webhook support for production
if (process.env.NODE_ENV === 'production') {
  const domain = process.env.DOMAIN;
  if (!domain) {
    throw new Error('DOMAIN environment variable is required in production');
  }
  
  const secretPath = `/webhook/${bot.secretPathComponent()}`;
  
  // Set webhook
  bot.telegram.setWebhook(`${domain}${secretPath}`)
    .then(() => {
      logger.info('Webhook set successfully');
    })
    .catch((error) => {
      logger.error('Error setting webhook:', error);
    });
    
  // Start webhook
  bot.launch({
    webhook: {
      domain: domain,
      path: secretPath,
      port: 3000
    }
  });
} else {
  // Start polling in development
  bot.launch()
    .then(() => {
      logger.info('Bot started successfully!');
    })
    .catch((error) => {
      logger.error('Error starting bot:', error);
    });
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
