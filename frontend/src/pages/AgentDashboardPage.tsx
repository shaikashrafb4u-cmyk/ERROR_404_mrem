import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { Ticket, DashboardStats, TicketStatus, TicketPriority } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { useToast } from '../hooks/useToast';
import {
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Building,
  Check,
  X,
  Eye,
  Star,
  Cpu
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const AgentDashboardPage: React.FC = () => {
  const { showToast } = useToast();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Selected Ticket for Drawer
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Drawer Edit Form States
  const [editStatus, setEditStatus] = useState<TicketStatus>('Open');
  const [editDept, setEditDept] = useState('Billing & Finance');
  const [editPriority, setEditPriority] = useState<TicketPriority>('Medium');
  const [internalNote, setInternalNote] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsData, ticketsData] = await Promise.all([
        ApiService.getDashboardStats(),
        ApiService.getTickets(),
      ]);
      setStats(statsData);
      setTickets(ticketsData);
    } catch (err) {
      console.error(err);
      showToast('Error loading cockpit data.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDrawer = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setEditStatus(ticket.status);
    setEditDept(ticket.department);
    setEditPriority(ticket.priority);
    setInternalNote('');
  };

  const handleUpdateTicket = async () => {
    if (!selectedTicket) return;
    setActionLoading(true);
    try {
      const updated = await ApiService.updateTicket(selectedTicket.ticketId, {
        status: editStatus,
        department: editDept,
        priority: editPriority,
        performedBy: 'Human Support Specialist (Admin)',
        note: internalNote || `Updated status to ${editStatus} and department to ${editDept}`,
      });

      setSelectedTicket(updated);
      setTickets((prev) => prev.map((t) => (t.ticketId === updated.ticketId ? updated : t)));
      showToast(`Ticket ${updated.ticketId} updated successfully.`, 'success');
      loadData();
    } catch (err: any) {
      showToast('Failed to update ticket.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuickResolve = async (ticket: Ticket) => {
    setActionLoading(true);
    try {
      const updated = await ApiService.updateTicket(ticket.ticketId, {
        status: 'Resolved',
        performedBy: 'Human Support Specialist (Admin)',
        note: 'Resolved directly from support cockpit.',
      });
      setTickets((prev) => prev.map((t) => (t.ticketId === updated.ticketId ? updated : t)));
      if (selectedTicket?.ticketId === ticket.ticketId) {
        setSelectedTicket(updated);
      }
      showToast(`Ticket ${ticket.ticketId} marked as Resolved.`, 'success');
      loadData();
    } catch (err) {
      showToast('Failed to resolve ticket.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuickEscalate = async (ticket: Ticket) => {
    setActionLoading(true);
    try {
      const updated = await ApiService.escalateTicket(
        ticket.ticketId,
        'Escalated via Support Cockpit Quick Action',
        'Tier-3 Urgent Operations'
      );
      setTickets((prev) => prev.map((t) => (t.ticketId === updated.ticketId ? updated : t)));
      if (selectedTicket?.ticketId === ticket.ticketId) {
        setSelectedTicket(updated);
      }
      showToast(`Ticket ${ticket.ticketId} escalated to Tier-3 team.`, 'warning');
      loadData();
    } catch (err) {
      showToast('Failed to escalate ticket.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.customerName && t.customerName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
      {/* Cockpit Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-[#141414] border border-[#262626] mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Human Specialist Cockpit
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Support Operations & Ticket Triage</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Live AI queue management, automated complaint monitoring, and priority escalation routing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] text-zinc-300 hover:text-white border border-[#2A2A2A] transition-colors flex items-center gap-2 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <div className="p-4 rounded-xl bg-[#141414] border border-[#242424]">
          <span className="text-[11px] text-zinc-400 block mb-1">Total Complaints</span>
          <div className="text-2xl font-extrabold text-white">{stats?.totalTickets ?? tickets.length}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#141414] border border-[#242424]">
          <span className="text-[11px] text-zinc-400 block mb-1">Open / In Queue</span>
          <div className="text-2xl font-extrabold text-blue-400">{stats?.openTickets ?? 0}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#141414] border border-[#242424]">
          <span className="text-[11px] text-zinc-400 block mb-1">High / Critical</span>
          <div className="text-2xl font-extrabold text-amber-400">{stats?.highPriorityTickets ?? 0}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#141414] border border-[#242424]">
          <span className="text-[11px] text-zinc-400 block mb-1">Escalated</span>
          <div className="text-2xl font-extrabold text-purple-400">{stats?.escalatedTickets ?? 0}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#141414] border border-[#242424]">
          <span className="text-[11px] text-zinc-400 block mb-1">Resolved</span>
          <div className="text-2xl font-extrabold text-emerald-400">{stats?.resolvedTickets ?? 0}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#141414] border border-[#242424]">
          <span className="text-[11px] text-zinc-400 block mb-1">Avg CSAT Rating</span>
          <div className="text-2xl font-extrabold text-yellow-400 flex items-center gap-1">
            <span>{stats?.avgRating ?? 4.9}</span>
            <Star className="w-4 h-4 fill-current inline" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-[#262626] mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets, customers, or summaries..."
            className="w-full bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Categories</option>
            <option value="Payment Issue">Payment Issue</option>
            <option value="Refund Issue">Refund Issue</option>
            <option value="Order Delay">Order Delay</option>
            <option value="Wrong Product">Wrong Product</option>
            <option value="Damaged Product">Damaged Product</option>
            <option value="Account/Login Issue">Account/Login Issue</option>
            <option value="Technical Issue">Technical Issue</option>
            <option value="Fraud/Suspicious Transaction">Fraud / Suspicious</option>
            <option value="General Inquiry">General Inquiry</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Status Filter */}
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

      {/* Tickets Master Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#262626] bg-[#141414] shadow-xl">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-[#191919] text-zinc-400 uppercase text-[10px] tracking-wider border-b border-[#262626]">
            <tr>
              <th className="px-4 py-3.5">Ticket ID</th>
              <th className="px-4 py-3.5">Customer</th>
              <th className="px-4 py-3.5">Complaint Summary</th>
              <th className="px-4 py-3.5">Category</th>
              <th className="px-4 py-3.5">Priority</th>
              <th className="px-4 py-3.5">Department</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222222]">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-zinc-500">
                  Loading tickets in support queue...
                </td>
              </tr>
            ) : filteredTickets.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-zinc-500">
                  No tickets found matching the specified filters.
                </td>
              </tr>
            ) : (
              filteredTickets.map((t) => (
                <tr
                  key={t.ticketId}
                  className="hover:bg-[#1A1A1A] transition-colors group cursor-pointer"
                  onClick={() => handleOpenDrawer(t)}
                >
                  <td className="px-4 py-3.5 font-mono font-bold text-white group-hover:text-blue-400">
                    {t.ticketId}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-white">{t.customerName || 'Alex Mercer'}</div>
                    <div className="text-[10px] text-zinc-500">{t.customerId}</div>
                  </td>
                  <td className="px-4 py-3.5 max-w-xs">
                    <div className="font-medium text-zinc-200 truncate">{t.title}</div>
                    <div className="text-[11px] text-zinc-400 truncate">{t.summary}</div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">{t.category}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <PriorityBadge priority={t.priority} />
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-zinc-400">{t.department}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={t.status} />
                    {t.escalationStatus === 'Escalated' && (
                      <span className="block mt-1 text-[9px] text-purple-400 font-bold uppercase tracking-wider">
                        • Escalated
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenDrawer(t)}
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#2A2A2A] text-zinc-300 hover:text-white border border-[#2F2F2F] transition-colors"
                        title="Inspect and Edit"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {t.status !== 'Resolved' && (
                        <button
                          onClick={() => handleQuickResolve(t)}
                          disabled={actionLoading}
                          className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                          title="Quick Mark Resolved"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {t.escalationStatus !== 'Escalated' && (
                        <button
                          onClick={() => handleQuickEscalate(t)}
                          disabled={actionLoading}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                          title="Escalate Ticket"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Ticket Management Inspection Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-[#141414] border-l border-[#262626] h-full overflow-y-auto p-6 flex flex-col shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-bold text-white">
                  {selectedTicket.ticketId}
                </span>
                <PriorityBadge priority={selectedTicket.priority} />
                <StatusBadge status={selectedTicket.status} />
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 rounded-lg bg-[#202020] text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="space-y-5 my-6 flex-1 text-xs">
              <div>
                <span className="text-zinc-500 block mb-1">Customer Overview</span>
                <div className="p-3 rounded-xl bg-[#181818] border border-[#262626] space-y-1">
                  <div className="font-semibold text-white">{selectedTicket.customerName || 'Alex Mercer'}</div>
                  <div className="text-zinc-400">{selectedTicket.customerEmail || 'alex.mercer@example.com'}</div>
                  <div className="text-zinc-500 font-mono">ID: {selectedTicket.customerId}</div>
                </div>
              </div>

              <div>
                <span className="text-zinc-500 block mb-1">AI Complaint Analysis</span>
                <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Autonomous Summary</span>
                  </div>
                  <p className="text-zinc-200 leading-relaxed">{selectedTicket.summary}</p>
                  <div className="pt-2 border-t border-[#2A2A2A] text-zinc-400">
                    <span className="text-emerald-400 font-medium">Recommended Action:</span>{' '}
                    {selectedTicket.recommendedAction}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-zinc-500 block mb-1">Original Customer Description</span>
                <div className="p-3 rounded-xl bg-[#181818] border border-[#262626] text-zinc-300 leading-relaxed">
                  "{selectedTicket.description}"
                </div>
              </div>

              {/* Edit Controls */}
              <div className="p-4 rounded-xl bg-[#1A1A1A] border border-[#2B2B2B] space-y-3">
                <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
                  Agent Controls & Routing
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-400 block mb-1">Update Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as TicketStatus)}
                      className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg p-2 text-xs text-white"
                    >
                      <option value="Open">Open</option>
                      <option value="Processing">Processing</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">Assign Department</label>
                    <select
                      value={editDept}
                      onChange={(e) => setEditDept(e.target.value)}
                      className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg p-2 text-xs text-white"
                    >
                      <option value="Billing & Finance">Billing & Finance</option>
                      <option value="Logistics & Dispatch">Logistics & Dispatch</option>
                      <option value="Fulfillment & Returns">Fulfillment & Returns</option>
                      <option value="Account Security">Account Security</option>
                      <option value="Security & Trust">Security & Trust</option>
                      <option value="Engineering Support">Engineering Support</option>
                      <option value="General Support">General Support</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Internal Specialist Note</label>
                  <input
                    type="text"
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder="Add remark to ticket lifecycle audit log..."
                    className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg p-2 text-xs text-white placeholder-zinc-500"
                  />
                </div>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="pt-4 border-t border-[#222222] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleQuickEscalate(selectedTicket)}
                disabled={actionLoading}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
              >
                Escalate Ticket
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleUpdateTicket}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white"
                >
                  {actionLoading ? 'Saving...' : 'Apply Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
