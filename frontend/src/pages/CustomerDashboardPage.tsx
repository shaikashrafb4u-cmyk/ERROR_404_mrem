import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ApiService } from '../services/api';
import { Ticket } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import {
  MessageSquare,
  Ticket as TicketIcon,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  Search,
  Filter,
  RefreshCw,
  Plus
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const CustomerDashboardPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const data = await ApiService.getTickets();
      setTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = tickets.filter((t) => t.status === 'Open' || t.status === 'Processing' || t.status === 'In Progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length;
  const escalatedCount = tickets.filter((t) => t.escalationStatus === 'Escalated').length;

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626] mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Customer Support Portal
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">
            Welcome back, <span className="text-blue-400">Alex Mercer</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Customer ID: <span className="font-mono text-zinc-300">CUST-DEMO-01</span> • Track all your active complaints and automated resolutions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTickets}
            className="p-2.5 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] text-zinc-400 hover:text-white border border-[#2A2A2A] transition-colors"
            title="Refresh tickets"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            to="/chat"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Report New Issue</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-[#141414] border border-[#242424]">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs">Total Tickets</span>
            <TicketIcon className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{tickets.length}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#141414] border border-[#242424]">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs">Active / In Progress</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{activeCount}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#141414] border border-[#242424]">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{resolvedCount}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#141414] border border-[#242424]">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs">Escalated to Specialist</span>
            <ShieldAlert className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{escalatedCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-[#262626] mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Ticket ID (CS-...), category, or title..."
            className="w-full bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs text-zinc-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Processing">Processing</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-12 text-center text-zinc-500 text-xs">Loading customer tickets...</div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-12 text-center bg-[#141414] border border-[#242424] rounded-2xl">
            <TicketIcon className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-sm text-zinc-300 font-medium">No tickets match your query</p>
            <p className="text-xs text-zinc-500 mt-1">Try changing filters or report an issue via Chat</p>
          </div>
        ) : (
          filteredTickets.map((t) => (
            <Link
              key={t.ticketId}
              to={`/ticket/${t.ticketId}`}
              className="block p-4 rounded-2xl bg-[#141414] hover:bg-[#181818] border border-[#242424] hover:border-blue-500/40 transition-all group shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-white group-hover:text-blue-400 transition-colors">
                    {t.ticketId}
                  </span>
                  <PriorityBadge priority={t.priority} />
                  <StatusBadge status={t.status} />
                  {t.escalationStatus === 'Escalated' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Escalated
                    </span>
                  )}
                </div>

                <span className="text-xs text-zinc-400">{formatDate(t.createdAt)}</span>
              </div>

              <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-white mb-1">
                {t.title}
              </h3>
              <p className="text-xs text-zinc-400 line-clamp-1 mb-3">{t.summary}</p>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-[#202020]">
                <span>
                  Department: <strong className="text-zinc-300 font-normal">{t.department}</strong>
                </span>
                <span className="text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};
