import { TicketPriority, TicketStatus, TicketCategory } from '../types';

export const formatDate = (date: string | Date | undefined): string => {
  if (!date) return 'Just now';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRelativeTime = (date: string | Date | undefined): string => {
  if (!date) return 'just now';
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHr > 0) return `${diffHr}h ago`;
  if (diffMin > 0) return `${diffMin}m ago`;
  return 'just now';
};

export const getPriorityBadgeStyle = (priority: TicketPriority) => {
  switch (priority) {
    case 'Critical':
      return 'bg-red-500/10 text-red-400 border-red-500/30';
    case 'High':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'Medium':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    case 'Low':
      return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30';
    default:
      return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30';
  }
};

export const getStatusBadgeStyle = (status: TicketStatus) => {
  switch (status) {
    case 'Open':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'Processing':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    case 'Assigned':
      return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    case 'In Progress':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    case 'Resolved':
      return 'bg-teal-500/10 text-teal-300 border-teal-500/30';
    case 'Closed':
      return 'bg-zinc-700/20 text-zinc-400 border-zinc-700/40';
    default:
      return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30';
  }
};
