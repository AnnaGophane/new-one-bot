import { Context, NarrowedContext } from 'telegraf';
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
  message?: Update.New & Update.NonChannel & Message.TextMessage;
}

export type MessageContext = NarrowedContext<BotContext, Update.MessageUpdate<Message>>;
