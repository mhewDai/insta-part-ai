import React from 'react';
import { Bot } from 'lucide-react';

export const TypingIndicator = () => {
  return (
    <div className="flex gap-3 animate-fade-in">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-chat-bot border border-border">
        <Bot className="w-4 h-4 text-chat-bot-foreground" />
      </div>

      {/* Typing Animation */}
      <div className="inline-block px-4 py-2 rounded-2xl rounded-bl-sm bg-chat-bot text-chat-bot-foreground border border-border shadow-message">
        <div className="flex gap-1 items-center">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-gentle"></div>
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-gentle" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-gentle" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};