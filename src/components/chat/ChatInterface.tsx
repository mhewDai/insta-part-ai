import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Wrench, Search, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from './ChatMessage';
import { QuickActions } from './QuickActions';
import { TypingIndicator } from './TypingIndicator';

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  productCard?: {
    name: string;
    partNumber: string;
    price: string;
    image: string;
    compatibility: string[];
  };
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your PartSelect assistant. I can help you find parts, check compatibility, and provide installation guidance for refrigerators and dishwashers. What can I help you with today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate API call to backend
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateBotResponse(inputValue),
        timestamp: new Date(),
        productCard: shouldShowProduct(inputValue) ? {
          name: 'Refrigerator Water Filter',
          partNumber: 'PS11752778',
          price: '$49.99',
          image: '/api/placeholder/200/150',
          compatibility: ['WDT780SAEM1', 'WRS325SDHZ', 'WRF535SWHZ']
        } : undefined,
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-chat">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Wrench className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">PartSelect Assistant</h1>
            <p className="text-sm text-muted-foreground">Refrigerator & Dishwasher Parts Expert</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <QuickActions onActionClick={handleQuickAction} />

      {/* Input Area */}
      <div className="bg-card border-t border-border px-6 py-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about parts, installation, or troubleshooting..."
              className="pr-10 transition-chat"
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 p-0"
            >
              <Image className="w-4 h-4" />
            </Button>
          </div>
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="transition-chat"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const generateBotResponse = (userInput: string): string => {
  const input = userInput.toLowerCase();
  
  if (input.includes('install') || input.includes('installation')) {
    return "I'll help you with installation instructions. Please provide the part number or model of your appliance, and I'll guide you through the step-by-step process.";
  }
  
  if (input.includes('compatible') || input.includes('compatibility')) {
    return "I can check part compatibility for you. Please share your appliance model number, and I'll verify which parts work with your specific unit.";
  }
  
  if (input.includes('ice maker') || input.includes('not working')) {
    return "Ice maker issues are common. Let me help troubleshoot this. First, can you tell me your refrigerator model and describe the specific problem you're experiencing?";
  }
  
  if (input.includes('ps11752778') || input.includes('part number')) {
    return "I found information about part PS11752778. This is a water filter compatible with several refrigerator models. Here are the details:";
  }
  
  return "I understand you need help with your appliance. Could you provide more details about your specific issue, including your appliance model number if possible?";
};

const shouldShowProduct = (userInput: string): boolean => {
  const input = userInput.toLowerCase();
  return input.includes('ps11752778') || 
         input.includes('water filter') || 
         input.includes('part number');
};