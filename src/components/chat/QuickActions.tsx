import React from 'react';
import { Search, Wrench, HelpCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  const actions = [
    {
      icon: Search,
      label: 'Find Parts',
      action: 'Help me find parts for my appliance',
    },
    {
      icon: Wrench,
      label: 'Installation',
      action: 'How do I install part number ',
    },
    {
      icon: HelpCircle,
      label: 'Compatibility',
      action: 'Is this part compatible with my model ',
    },
    {
      icon: Zap,
      label: 'Troubleshoot',
      action: 'My appliance is not working properly',
    },
  ];

  return (
    <div className="px-6 py-3 bg-card border-t border-border">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            size="sm"
            onClick={() => onActionClick(action.action)}
            className="flex items-center gap-2 whitespace-nowrap transition-chat hover:bg-accent"
          >
            <action.icon className="w-4 h-4" />
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
};