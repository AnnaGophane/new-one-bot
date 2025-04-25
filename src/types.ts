import { Context } from 'telegraf';
import { Message, Update } from 'telegraf/types';

export interface SessionData {
  messageHistory: ChatMessage[];
  lastInteraction: number;
  totalRequests: number;
  model: string;
  maxHistory: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface BotContext extends Context {
  session: SessionData;
  isOwner: boolean;
  message: Update.New & Update.NonChannel & Message;
}

export type MessageContext = Context<{
  message: Update.New & Update.NonChannel & Message;
  update_id: number;
}>;
