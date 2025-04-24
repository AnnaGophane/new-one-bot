import { Context, NarrowedContext } from 'telegraf';
import { Message, Update } from 'telegraf/types';

export interface SessionData {
  messageHistory: ChatMessage[];
  lastInteraction: number;
  totalRequests: number;
  model: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface BotContext extends Context {
  session: SessionData;
  isOwner: boolean;
}

export type MessageContext = NarrowedContext<BotContext, Update.MessageUpdate>;

export interface UserStats {
  userId: string;
  username?: string;
  messageCount: number;
  lastActive: Date;
}
