import React from 'react';
import { User, Bot } from 'lucide-react';
import { Message } from './ChatInterface';
import { ProductCard } from './ProductCard';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex gap-3 animate-fade-in ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-chat-user text-chat-user-foreground'
            : 'bg-chat-bot border border-border'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4 text-chat-bot-foreground" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[70%] ${isUser ? 'text-right' : ''}`}>
        <div
          className={`inline-block px-4 py-2 rounded-2xl shadow-message transition-chat ${
            isUser
              ? 'bg-chat-user text-chat-user-foreground rounded-br-sm'
              : 'bg-chat-bot text-chat-bot-foreground border border-border rounded-bl-sm'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Product Card */}
        {message.productCard && !isUser && (
          <div className="mt-3">
            <ProductCard product={message.productCard} />
          </div>
        )}

        {/* Timestamp */}
        <div className={`mt-1 text-xs text-muted-foreground ${isUser ? 'text-right' : ''}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};