import { createReadStream } from 'fs';
import { AssemblyAI } from 'assemblyai'; // Import AssemblyAI client
import { logger } from '../utils/logger.js';

const assemblyai = new AssemblyAI(process.env.ASSEMBLYAI_API_KEY); // Replace with your AssemblyAI API key

export const transcribeAudio = async (audioPath: string): Promise<string> => {
  try {
    const audioBytes = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      createReadStream(audioPath)
        .on('data', (chunk: Buffer | string) => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        })
        .on('end', () => resolve(Buffer.concat(chunks)))
        .on('error', reject);
    });

    const transcript = await assemblyai.transcribe({
      audio_url: `data:audio/ogg;base64,${audioBytes.toString('base64')}`, // Send audio as base64
      language_code: 'en-US', // Set language code
      model_id: 'whisper-1' // Or another suitable model
    });

    return transcript.text;
  } catch (error) {
    logger.error('Error transcribing audio:', error);
    throw new Error('Failed to transcribe audio');
  }
};

// Remove convertOggToWav function as it's no longer needed with AssemblyAI
