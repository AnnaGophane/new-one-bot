import dotenv from 'dotenv';
import { logger } from './utils/logger';
// Load environment variables
dotenv.config();
// Define required environment variables
const requiredEnvVars = [
    'TELEGRAM_BOT_TOKEN',
    'OPENAI_API_KEY',
    'OWNER_USER_ID'
];
// Check for required environment variables
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        logger.error(`Missing required environment variable: ${envVar}`);
        process.exit(1);
    }
}
export const config = {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OWNER_USER_ID: process.env.OWNER_USER_ID,
    MAX_HISTORY_LENGTH: parseInt(process.env.MAX_HISTORY_LENGTH || '10', 10),
    DEFAULT_MODEL: process.env.DEFAULT_MODEL || 'gpt-3.5-turbo',
    PREMIUM_MODEL: process.env.PREMIUM_MODEL || 'gpt-4',
};
