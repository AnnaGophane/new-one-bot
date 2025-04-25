import { MessageContext } from '../types';
import { processWithAI } from '../services/aiServices';
import { transcribeAudio, convertOggToWav } from '../services/voiceService';
import { analyzeImage } from '../services/imageService';
import { logger } from '../utils/logger';
import axios from 'axios';
import { createWriteStream, unlink } from 'fs';
import { promisify } from 'util';
import path from 'path';
import { Message } from 'telegraf/types';

const unlinkAsync = promisify(unlink);

export const handleMessage = async (ctx: MessageContext) => {
  try {
    await ctx.sendChatAction('typing');

    
    if ('text' in ctx.message) {
      ctx.session.messageHistory.push({
        role: 'user',
        content: ctx.message.text
      });

      const response = await processWithAI(ctx.session.messageHistory, ctx.session.model);

      ctx.session.messageHistory.push({
        role: 'assistant',
        content: response
      });

      await ctx.reply(response, { parse_mode: 'Markdown' });
    }

    else if ('voice' in ctx.message) {
      const file = await ctx.telegram.getFile(ctx.message.voice.file_id);
      const filePath = file.file_path;

      if (!filePath) {
        throw new Error('Could not get voice file path');
      }

      const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`;
      const response = await axios.get(fileUrl, { responseType: 'stream' });

      const tempOggPath = path.join('/tmp', `${file.file_id}.ogg`);
      const tempWavPath = path.join('/tmp', `${file.file_id}.wav`);

      await new Promise((resolve, reject) => {
        response.data
          .pipe(createWriteStream(tempOggPath))
          .on('finish', resolve)
          .on('error', reject);
      });

      await convertOggToWav(tempOggPath, tempWavPath);
      const transcription = await transcribeAudio(tempWavPath);


      await Promise.all([
        unlinkAsync(tempOggPath),
        unlinkAsync(tempWavPath)
      ]);


      ctx.session.messageHistory.push({
        role: 'user',
        content: transcription
      });

      const aiResponse = await processWithAI(ctx.session.messageHistory, ctx.session.model);

      ctx.session.messageHistory.push({
        role: 'assistant',
        content: aiResponse
      });

      await ctx.reply(`🎤 Transcription: ${transcription}\n\n${aiResponse}`, { parse_mode: 'Markdown' });
    }

    else if ('photo' in ctx.message) {
      const photo = ctx.message.photo[ctx.message.photo.length - 1];
      const file = await ctx.telegram.getFile(photo.file_id);

      if (!file.file_path) {
        throw new Error('Could not get photo file path');
      }

      const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });

      const imageAnalysis = await analyzeImage(Buffer.from(response.data));

      ctx.session.messageHistory.push({
        role: 'user',
        content: `[Image Analysis] ${imageAnalysis}`
      });

      const aiResponse = await processWithAI(ctx.session.messageHistory, ctx.session.model);

      ctx.session.messageHistory.push({
        role: 'assistant',
        content: aiResponse
      });

      await ctx.reply(`🖼 Image Analysis:\n${imageAnalysis}\n\n${aiResponse}`, { parse_mode: 'Markdown' });
    }


    if (ctx.session.messageHistory.length > ctx.session.maxHistory) {
      ctx.session.messageHistory = ctx.session.messageHistory.slice(-ctx.session.maxHistory);
    }
  } catch (error) {
    logger.error('Error handling message:', error);
    await ctx.reply('Sorry, I encountered an error processing your message. Please try again later.');
  }
};
