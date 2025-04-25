import { createReadStream } from 'fs';
import { SpeechClient } from '@google-cloud/speech';
import ffmpeg from 'fluent-ffmpeg';
import { logger } from '../utils/logger.js';

const speechClient = new SpeechClient();

export const convertOggToWav = async (oggPath: string, wavPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg(oggPath)
      .toFormat('wav')
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .save(wavPath);
  });
};

export const transcribeAudio = async (audioPath: string): Promise<string> => {
  try {
    const audioBytes = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      createReadStream(audioPath)
        .on('data', (chunk: Buffer) => {
          chunks.push(chunk);
          return chunks.length;
        })
        .on('end', () => resolve(Buffer.concat(chunks)))
        .on('error', reject);
    });

    const audio = {
      content: audioBytes.toString('base64'),
    };

    const config = {
      encoding: 'LINEAR16' as const,
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    };

    const request = {
      audio: audio,
      config: config,
    };

    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      ?.map(result => result.alternatives?.[0]?.transcript)
      .join('\n') || '';

    return transcription;
  } catch (error) {
    logger.error('Error transcribing audio:', error);
    throw new Error('Failed to transcribe audio');
  }
};
