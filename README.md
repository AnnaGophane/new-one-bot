# Advanced Telegram AI Bot

A powerful Telegram bot that provides premium AI features for free to all Telegram users.

## Features

- Advanced AI responses using OpenAI's GPT models
- Conversation history for contextual understanding
- Owner administration commands
- Rate limiting to prevent abuse
- Multi-modal support (text, with image and voice coming soon)
- User settings and preferences

## Deployment on Railway

1. Fork this repository
2. Create a new project on [Railway](https://railway.app)
3. Connect your GitHub repository
4. Add the following environment variables in Railway:
   - `TELEGRAM_BOT_TOKEN`: Your Telegram bot token from @BotFather
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `OWNER_USER_ID`: Your Telegram user ID
   - `DOMAIN`: Your Railway app domain (e.g., https://your-app.railway.app)
   - `NODE_ENV`: Set to "production"

Railway will automatically detect the configuration and deploy your bot.

## Local Development

### Prerequisites

- Node.js (v18 or higher)
- Telegram Bot Token (from @BotFather)
- OpenAI API Key

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy the example environment file:
   ```
   cp .env.example .env
   ```
4. Edit the `.env` file with your credentials

### Running the Bot

Development mode:
```
npm run dev
```

Production mode:
```
npm run build
npm start
```

## Bot Commands

### User Commands

- `/start` - Start the bot
- `/help` - Show help information
- `/clear` - Clear conversation history
- `/model` - Show current AI model
- `/settings` - Adjust user settings

### Owner Commands

- `/stats` - Show bot statistics
- `/broadcast` - Send a message to all users
- `/logs` - Get recent logs
- `/setmodel` - Set default AI model
- `/getstats` - Get specific user stats

## License

This project is licensed under the MIT License - see the LICENSE file for details.
