import { ImageAnnotatorClient } from '@google-cloud/vision';
import { OpenAI } from 'openai';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

const visionClient = new ImageAnnotatorClient();
const openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });

export const analyzeImage = async (imageBuffer: Buffer): Promise<string> => {
  try {
    // Get labels and text from the image
    const [labelResult] = await visionClient.labelDetection({
      image: { content: imageBuffer.toString('base64') }
    });
    const [textResult] = await visionClient.textDetection({
      image: { content: imageBuffer.toString('base64') }
    });

    const labels = labelResult.labelAnnotations?.map(label => label.description) || [];
    const text = textResult.textAnnotations?.[0]?.description || '';

    // Use GPT to generate a natural description
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that helps analyze images. Provide clear, concise descriptions."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Describe this image based on these details:\nLabels: ${labels.join(', ')}\nText found: ${text}`
            }
          ]
        }
      ]
    });

    return response.choices[0]?.message?.content || 'Could not analyze image';
  } catch (error) {
    logger.error('Error analyzing image:', error);
    throw new Error('Failed to analyze image');
  }
};
