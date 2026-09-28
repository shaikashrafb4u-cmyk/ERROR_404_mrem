import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ApiService } from '../services/api';
import { Ticket, TicketStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { useToast } from '../hooks/useToast';
import {
  ArrowLeft,
  ShieldAlert,
  Clock,
  User,
  Building,
  CheckCircle,
  Star,
  MessageSquare,
  AlertCircle,
  Cpu,
  Send,
  Sparkles
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status update state
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Escalation state
  const [isEscalating, setIsEscalating] = useState(false);
  const [escalationReason, setEscalationReason] = useState('');
  const [showEscalateModal, setShowEscalateModal] = useState(false);

  // Feedback state
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await ApiService.getTicketById(id);
      setTicket(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Ticket not found.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (!ticket) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await ApiService.updateTicket(ticket.ticketId, {
        status: newStatus,
        performedBy: 'Customer / Agent Portal',
        note: `Ticket moved to ${newStatus}`,
      });
      setTicket(updated);
      showToast(`Status updated to ${newStatus}.`, 'success');
    } catch (err: any) {
      showToast('Failed to update status.', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleEscalate = async () => {
    if (!ticket) return;
    setIsEscalating(true);
    try {
      const updated = await ApiService.escalateTicket(
        ticket.ticketId,
        escalationReason || 'Customer requested urgent escalation.'
      );
      setTicket(updated);
      setShowEscalateModal(false);
      setEscalationReason('');
      showToast('Ticket escalated to Level-2 Human Specialist.', 'warning');
    } catch (err: any) {
      showToast('Failed to escalate ticket.', 'error');
    } finally {
      setIsEscalating(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket) return;
    setIsSubmittingFeedback(true);
    try {
      await ApiService.submitFeedback(
        ticket.ticketId,
        rating,
        feedbackComment,
        ticket.customerName || 'Alex Mercer'
      );
      setFeedbackSubmitted(true);
      showToast('Feedback submitted successfully. Thank you!', 'success');
    } catch (err: any) {
      showToast('Failed to submit feedback.', 'error');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-zinc-400">Loading ticket dossier...</span>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex-1 max-w-3xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Ticket Not Found</h2>
        <p className="text-sm text-zinc-400 mb-6">{error || `No ticket matches ID "${id}".`}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tickets Dashboard
        </Link>
      </div>
    );
  }

  const isEscalated = ticket.escalationStatus === 'Escalated' || ticket.escalationStatus === 'Human Specialist Assigned';

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tickets</span>
        </Link>

        <div className="flex items-center gap-2">
          {!isEscalated && (
            <button
              onClick={() => setShowEscalateModal(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Escalate to Human</span>
            </button>
          )}

          <Link
            to="/chat"
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Open Support Chat</span>
          </Link>
        </div>
      </div>

      {/* Ticket Header Dossier Card */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626] mb-6 shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#222222]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl font-mono font-bold text-white">{ticket.ticketId}</span>
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
              {isEscalated && (
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  Escalated
                </span>
              )}
            </div>
            <h1 className="text-lg font-semibold text-zinc-100">{ticket.title}</h1>
          </div>

          <div className="text-right text-xs text-zinc-400">
            <div>Created: {formatDate(ticket.createdAt)}</div>
            <div>Updated: {formatDate(ticket.updatedAt)}</div>
          </div>
        </div>

        {/* 4-Column Quick Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div>
            <span className="text-zinc-500 block mb-1">Customer</span>
            <div className="flex items-center gap-1.5 text-zinc-200 font-medium">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>{ticket.customerName || 'Alex Mercer'}</span>
            </div>
            <span className="text-[11px] text-zinc-500">{ticket.customerEmail || 'alex.mercer@example.com'}</span>
          </div>

          <div>
            <span className="text-zinc-500 block mb-1">Category</span>
            <div className="text-zinc-200 font-medium">{ticket.category}</div>
          </div>

          <div>
            <span className="text-zinc-500 block mb-1">Assigned Department</span>
            <div className="flex items-center gap-1.5 text-zinc-200 font-medium">
              <Building className="w-3.5 h-3.5 text-zinc-400" />
              <span>{ticket.department}</span>
            </div>
          </div>

          <div>
            <span className="text-zinc-500 block mb-1">Quick Status Transition</span>
            <div className="flex items-center gap-1.5">
              <select
                value={ticket.status}
                disabled={isUpdatingStatus}
                onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                className="bg-[#1C1C1C] border border-[#2E2E2E] rounded-lg px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
              >
                <option value="Open">Open</option>
                <option value="Processing">Processing</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Analysis & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details, Rationale, and Feedback */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Problem & AI Summary */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626] space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
              Complaint Dossier
            </h3>

            <div>
              <span className="text-xs font-medium text-zinc-400">Customer Description:</span>
              <p className="mt-1 p-3 rounded-xl bg-[#181818] border border-[#242424] text-sm text-zinc-200 leading-relaxed">
                "{ticket.description}"
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
                <Cpu className="w-4 h-4" />
                <span>AI Intelligence Summary</span>
              </div>
              <p className="text-sm text-zinc-200 leading-relaxed">{ticket.summary}</p>
            </div>

            <div>
              <span className="text-xs font-medium text-zinc-400">Recommended Resolution Action:</span>
              <p className="mt-1 text-xs text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                {ticket.recommendedAction}
              </p>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Customer Satisfaction & Feedback</span>
            </h3>

            {feedbackSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Thank you! Your feedback has been recorded and factored into the AI CSAT model.</span>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4 mt-3">
                <div>
                  <span className="text-xs text-zinc-400 block mb-1.5">How would you rate the resolution?</span>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          rating >= star
                            ? 'text-amber-400 border-amber-500/40 bg-amber-400/10'
                            : 'text-zinc-600 border-[#242424] hover:text-zinc-400'
                        }`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                    <span className="text-xs font-semibold text-zinc-300 ml-2">
                      {rating} out of 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-zinc-400 block mb-1">Comments or remarks:</span>
                  <textarea
                    rows={2}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Tell us about your experience..."
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 placeholder-zinc-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingFeedback}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit CSAT Feedback</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Col: Timeline */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626] h-fit">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Ticket Lifecycle Timeline</span>
          </h3>

          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-[#252525]">
            {ticket.timeline && ticket.timeline.length > 0 ? (
              ticket.timeline.map((event, idx) => (
                <div key={idx} className="relative flex items-start gap-3 pl-1">
                  <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-[#141414] flex items-center justify-center shrink-0 z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white">{event.event}</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      By <span className="text-blue-400">{event.performedBy}</span> •{' '}
                      {formatDate(event.timestamp)}
                    </div>
                    {event.note && (
                      <p className="text-[11px] text-zinc-400 mt-1 bg-[#1C1C1C] p-2 rounded-lg border border-[#262626]">
                        {event.note}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500 pl-4">No timeline events recorded.</p>
            )}
          </div>
        </div>
      </div>

      {/* Escalation Confirmation Modal */}
      {showEscalateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#141414] border border-[#2E2E2E] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <ShieldAlert className="w-6 h-6" />
              <h4 className="text-base font-bold text-white">Escalate to Human Specialist</h4>
            </div>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Escalating routes this ticket directly to our on-call Human Incident Specialist desk.
              The ticket priority will be preserved and flagged for expedited resolution.
            </p>

            <textarea
              rows={3}
              value={escalationReason}
              onChange={(e) => setEscalationReason(e.target.value)}
              placeholder="Provide reason for escalation (e.g. 'Customer is requesting supervisor review')..."
              className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-rose-500 mb-4 placeholder-zinc-500"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEscalateModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isEscalating}
                onClick={handleEscalate}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white"
              >
                {isEscalating ? 'Escalating...' : 'Confirm Escalation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
