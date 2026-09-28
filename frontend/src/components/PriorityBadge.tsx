import React from 'react';
import { TicketPriority } from '../types';
import { getPriorityBadgeStyle } from '../utils/formatters';
import { Flame, AlertTriangle, ArrowUpRight, ArrowDown } from 'lucide-react';

interface PriorityBadgeProps {
  priority: TicketPriority;
  showIcon?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, showIcon = true }) => {
  const getIcon = () => {
    switch (priority) {
      case 'Critical':
        return <Flame className="w-3 h-3 text-red-400" />;
      case 'High':
        return <AlertTriangle className="w-3 h-3 text-amber-400" />;
      case 'Medium':
        return <ArrowUpRight className="w-3 h-3 text-blue-400" />;
      case 'Low':
        return <ArrowDown className="w-3 h-3 text-zinc-400" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getPriorityBadgeStyle(
        priority
      )}`}
    >
      {showIcon && getIcon()}
      {priority}
    </span>
  );
};
