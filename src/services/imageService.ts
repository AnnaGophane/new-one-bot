import Clarifai from 'clarifai'; // Import Clarifai client
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

const app = new Clarifai.App({apiKey: process.env.CLARIFAI_API_KEY}); // Replace with your Clarifai API key

export const analyzeImage = async (imageBuffer: Buffer): Promise<string> => {
  try {
    const response = await app.models.predict("general-image", imageBuffer);
    const concepts = response.outputs[0].data.concepts;
    const description = concepts.map(concept => concept.name).join(', ');
    return `Image contains: ${description}`;
  } catch (error) {
    logger.error('Error analyzing image:', error);
    throw new Error('Failed to analyze image');
  }
};
