import { Telegraf, session } from 'telegraf';
import { message } from 'telegraf/filters';
import { config } from './config';
import { setupCommands } from './commands';
import { handleMessage } from './handlers/messageHandler';
import { initializeMiddleware } from './middleware';
import { logger } from './utils/logger';
// Initialize the bot
const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);
// Set up session middleware
bot.use(session());
// Initialize custom middleware
initializeMiddleware(bot);
// Set up commands
setupCommands(bot);
// Handle text messages
bot.on(message('text'), handleMessage);
// Handle voice messages
bot.on(message('voice'), async (ctx) => {
    await ctx.reply('Voice message processing is coming soon!');
});
// Handle image messages
bot.on(message('photo'), async (ctx) => {
    await ctx.reply('Image processing is coming soon!');
});
// Add webhook support for production
if (process.env.NODE_ENV === 'production') {
    const domain = process.env.DOMAIN || '';
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
    bot.startWebhook(secretPath, null, 3000);
}
else {
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
