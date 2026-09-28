import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ApiService } from '../services/api';
import { ChatMessage, Ticket } from '../types';
import { ComplaintSummaryCard } from '../components/ComplaintSummaryCard';
import { QuickPrompts } from '../components/QuickPrompts';
import { useToast } from '../hooks/useToast';
import {
  Send,
  Bot,
  User,
  Sparkles,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  Info,
  Clock
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const ChatPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const [sessionId] = useState<string>(() => 'sess_' + Date.now());
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'ai',
      text: "👋 Welcome to **Nexura AI Customer Support**. I'm your autonomous support specialist. How can I help you today? You can report an issue with an order, a payment deduction, delivery delays, or select a scenario below.",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastCreatedTicket, setLastCreatedTicket] = useState<Ticket | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle URL parameter trigger for quick demo e.g. /chat?demo=payment
  useEffect(() => {
    const demoParam = searchParams.get('demo');
    if (demoParam === 'payment' && messages.length === 1) {
      handleSendMessage('My payment was deducted but my order was not placed.');
    }
  }, [searchParams]);

  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputText).trim();
    if (!message || isLoading) return;

    setInputText('');

    // Append customer message
    const userMessage: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'customer',
      text: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build lightweight conversation history for the backend
      const history = messages.slice(-4).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await ApiService.sendChatMessage(message, sessionId, history);

      const aiMessage: ChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: res.reply,
        timestamp: new Date(),
        analysis: res.analysis,
        ticket: res.ticket || undefined,
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (res.ticket) {
        setLastCreatedTicket(res.ticket);
        showToast(`Ticket ${res.ticket.ticketId} created successfully.`, 'success');

        if (res.ticket.escalationStatus === 'Escalated') {
          showToast('Urgent priority detected: Ticket escalated to Human Specialist.', 'warning');
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Error communicating with support agent.', 'error');
      setMessages((prev) => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          sender: 'ai',
          text: "I'm having a brief issue reaching our support intelligence service. Please ensure the backend server is running on http://localhost:5000 and try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome_' + Date.now(),
        sender: 'ai',
        text: "Conversation reset. How can I assist you with your orders, payments, or account today?",
        timestamp: new Date(),
      },
    ]);
    setLastCreatedTicket(null);
    showToast('Conversation cleared.', 'info');
  };

  return (
    <div className="flex-1 flex flex-col max-w-5xl w-full mx-auto px-4 py-6">
      {/* Top Chat Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#141414] border border-[#262626] mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#141414]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Nexura Support Agent</h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                Active Intelligence
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Session ID: <span className="font-mono text-zinc-300">{sessionId.substring(0, 16)}...</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {lastCreatedTicket && (
            <Link
              to={`/ticket/${lastCreatedTicket.ticketId}`}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-all flex items-center gap-1.5"
            >
              <span>View Latest Ticket ({lastCreatedTicket.ticketId})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          <button
            onClick={handleClearChat}
            className="p-2 rounded-lg bg-[#1C1C1C] hover:bg-[#252525] text-zinc-400 hover:text-white border border-[#2B2B2B] transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-[#0F0F0F] border border-[#222222] min-h-[420px] max-h-[560px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed ${
                msg.sender === 'customer'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/10 rounded-br-none'
                  : 'bg-[#161616] border border-[#282828] text-zinc-200 rounded-bl-none'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1">
                <span className="text-[11px] font-semibold text-zinc-400">
                  {msg.sender === 'customer' ? 'You (Alex Mercer)' : 'Nexura AI'}
                </span>
                <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(msg.timestamp)}
                </span>
              </div>

              {/* Message text with bold markup support */}
              <div className="whitespace-pre-wrap">
                {msg.text.split('**').map((chunk, i) =>
                  i % 2 === 1 ? (
                    <strong key={i} className="text-white font-semibold">
                      {chunk}
                    </strong>
                  ) : (
                    chunk
                  )
                )}
              </div>

              {/* Render Complaint Intelligence card if ticket was generated */}
              {msg.ticket && <ComplaintSummaryCard ticket={msg.ticket} />}
            </div>

            {msg.sender === 'customer' && (
              <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-zinc-300" />
              </div>
            )}
          </div>
        ))}

        {/* AI Typing Indicator */}
        {isLoading && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-blue-400 animate-pulse" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#161616] border border-[#282828] flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-mono">Nexura AI analyzing complaint semantics</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]" />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Drawer */}
      <div className="mt-3">
        <QuickPrompts onSelectPrompt={handleSendMessage} disabled={isLoading} />
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="mt-3 relative flex items-center gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Describe your issue (e.g. 'My payment was deducted but my order was not placed')..."
          disabled={isLoading}
          className="flex-1 bg-[#141414] border border-[#2A2A2A] focus:border-blue-500 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-5 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-medium text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
