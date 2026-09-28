import React from 'react';
import { Bot, Heart, Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#222222] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
              <span className="font-bold text-base text-white">Nexura AI</span>
            </div>
            <p className="text-sm text-zinc-400 max-w-sm mb-4 leading-relaxed">
              Enterprise AI Customer Support Agent with Autonomous Complaint Intelligence,
              zero-latency priority triage, and smart escalation routing.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>All systems operational • Demo Engine 100% Offline Ready</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link to="/chat" className="hover:text-blue-400 transition-colors">
                  Autonomous Chat
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-blue-400 transition-colors">
                  Customer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/agent" className="hover:text-blue-400 transition-colors">
                  Support Specialist Cockpit
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">Architecture</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Structured Intent AI
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                Smart Human Escalation
              </li>
              <li className="text-xs text-zinc-500 pt-1">
                Zero API Key Required Demo Mode
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#1C1C1C] flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} Nexura AI. Built for Microsoft-Sponsored Open Hackathon.</p>
          <div className="flex items-center gap-1">
            <span>Engineered with precision for autonomous customer care</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
