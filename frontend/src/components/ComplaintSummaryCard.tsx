import React from 'react';
import { Ticket } from '../types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Ticket as TicketIcon, ArrowRight, UserCheck, ShieldAlert, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ComplaintSummaryCardProps {
  ticket: Ticket;
}

export const ComplaintSummaryCard: React.FC<ComplaintSummaryCardProps> = ({ ticket }) => {
  const isEscalated = ticket.escalationStatus === 'Escalated' || ticket.escalationStatus === 'Human Specialist Assigned';

  return (
    <div className="mt-3 w-full max-w-xl bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4 shadow-xl shadow-black/40 hover:border-blue-500/40 transition-all">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#242424]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <TicketIcon className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 font-mono">TICKET ID</span>
            <div className="text-sm font-bold text-white tracking-wider font-mono">
              {ticket.ticketId}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      {/* Escalation alert if applicable */}
      {isEscalated && (
        <div className="mt-3 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs">
          <ShieldAlert className="w-4 h-4 shrink-0 text-purple-400" />
          <span>
            <strong>Smart Escalation Triggered:</strong> Routed to {ticket.department} for priority human review.
          </span>
        </div>
      )}

      {/* Details Grid */}
      <div className="mt-3 space-y-2 text-xs">
        <div>
          <span className="text-zinc-500">Category:</span>{' '}
          <span className="text-zinc-200 font-medium">{ticket.category}</span>
        </div>

        <div>
          <span className="text-zinc-500">Assigned Department:</span>{' '}
          <span className="text-zinc-200 font-medium">{ticket.department}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#1B1B1B] border border-[#262626]">
          <div className="flex items-center gap-1.5 text-blue-400 font-medium mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Complaint Summary:</span>
          </div>
          <p className="text-zinc-300 leading-relaxed">{ticket.summary}</p>
        </div>

        <div className="p-2.5 rounded-xl bg-[#181818] border border-[#242424]">
          <span className="text-zinc-400 font-medium">Recommended Action:</span>
          <p className="text-zinc-300 mt-0.5">{ticket.recommendedAction}</p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-[#222222] flex items-center justify-between">
        <span className="text-[11px] text-zinc-500">
          Status is synced live across the agent cockpit
        </span>
        <Link
          to={`/ticket/${ticket.ticketId}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 transition-all group"
        >
          <span>View Ticket Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
