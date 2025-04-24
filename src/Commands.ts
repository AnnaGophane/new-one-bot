import { Telegraf } from 'telegraf';
import { BotContext } from './types';
import { config } from './config';
import { userCommandsHandler } from './handlers/userCommandsHandler';
import { ownerCommandsHandler } from './handlers/ownerCommandsHandler';
import { logger } from './utils/logger';

// Setup bot commands
export const setupCommands = (bot: Telegraf<BotContext>) => {
  // Public commands
  bot.command('start', userCommandsHandler.start);
  bot.command('help', userCommandsHandler.help);
  bot.command('clear', userCommandsHandler.clearHistory);
  bot.command('model', userCommandsHandler.showModel);
  bot.command('settings', userCommandsHandler.showSettings);
  
  // Owner-only commands
  bot.command('stats', ownerCommandsHandler.showStats);
  bot.command('broadcast', ownerCommandsHandler.broadcast);
  bot.command('logs', ownerCommandsHandler.getLogs);
  bot.command('setmodel', ownerCommandsHandler.setDefaultModel);
  bot.command('getstats', ownerCommandsHandler.getUserStats);
  
  // Set bot commands for Telegram menu
  bot.telegram.setMyCommands([
    { command: 'start', description: 'Start the bot' },
    { command: 'help', description: 'Show help information' },
    { command: 'clear', description: 'Clear conversation history' },
    { command: 'model', description: 'Show current AI model' },
    { command: 'settings', description: 'Adjust your settings' }
  ])
  .then(() => {
    logger.info('Bot commands set successfully');
  })
  .catch((error) => {
    logger.error('Error setting bot commands:', error);
  });
  
  // Set owner commands separately (only visible to owner)
  bot.telegram.setMyCommands([
    { command: 'stats', description: 'Show bot statistics' },
    { command: 'broadcast', description: 'Send message to all users' },
    { command: 'logs', description: 'Get recent logs' },
    { command: 'setmodel', description: 'Set default AI model' },
    { command: 'getstats', description: 'Get specific user stats' }
  ], 
  { 
    scope: { type: 'chat', chat_id: parseInt(config.OWNER_USER_ID, 10) } 
  })
  .then(() => {
    logger.info('Owner commands set successfully');
  })
  .catch((error) => {
    logger.error('Error setting owner commands:', error);
  });
};
