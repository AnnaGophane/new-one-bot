import { Telegraf, session } from 'telegraf';
import { message } from 'telegraf/filters';
import { config } from './config';
import { setupCommands } from './Commands';
import { handleMessage } from './handlers/messageHandler';
import { BotContext } from './types';
import { initializeMiddleware } from './middleware';
import { logger } from './utils/logger';


const bot = new Telegraf<BotContext>(config.TELEGRAM_BOT_TOKEN);


bot.use(session());


initializeMiddleware(bot);


setupCommands(bot);


bot.on(message('text'), (ctx) => handleMessage(ctx));


bot.on(message('voice'), (ctx) => handleMessage(ctx));


bot.on(message('photo'), (ctx) => handleMessage(ctx));


if (process.env.NODE_ENV === 'production') {
  const domain = process.env.DOMAIN;
  if (!domain) {
    throw new Error('DOMAIN environment variable is required in production');
  }

  const secretPath = `/webhook/${bot.secretPathComponent()}`;


  bot.telegram.setWebhook(`${domain}${secretPath}`)
    .then(() => {
      logger.info('Webhook set successfully');
    })
    .catch((error) => {
      logger.error('Error setting webhook:', error);
    });

  bot.launch({
    webhook: {
      domain: domain,
      path: secretPath,
      port: 3000
    }
  });
} else {

  bot.launch()
    .then(() => {
      logger.info('Bot started successfully!');
    })
    .catch((error) => {
      logger.error('Error starting bot:', error);
    });
}


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
