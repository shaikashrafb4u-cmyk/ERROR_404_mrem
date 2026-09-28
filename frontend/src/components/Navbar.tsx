import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, Sparkles, LayoutDashboard, ShieldCheck, Menu, X, MessageSquare } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#0A0A0A]/85 backdrop-blur-md border-b border-[#242424]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/10">
              <div className="w-full h-full bg-[#0E0E0E] rounded-[11px] flex items-center justify-center group-hover:bg-[#141414] transition-colors">
                <Bot className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  Nexura<span className="text-blue-500">.AI</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Agentic Support
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Support that understands. Resolves. Remembers.
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5">
            <Link
              to="/chat"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                isActive('/chat')
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-zinc-300 hover:text-white hover:bg-[#181818]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Customer Chat
            </Link>

            <Link
              to="/dashboard"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                isActive('/dashboard')
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-zinc-300 hover:text-white hover:bg-[#181818]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              My Tickets
            </Link>

            <Link
              to="/agent"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                isActive('/agent')
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-zinc-300 hover:text-white hover:bg-[#181818]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Agent Cockpit
            </Link>
          </div>

          {/* Right Status / CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#282828] text-xs text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Demo Mode Ready</span>
            </div>

            <Link
              to="/chat?demo=payment"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Launch Demo Flow
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#141414] text-zinc-400 hover:text-white border border-[#262626]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F0F0F] border-b border-[#242424] px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/chat"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
              isActive('/chat') ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-300 hover:bg-[#181818]'
            }`}
          >
            Customer Chat
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
              isActive('/dashboard') ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-300 hover:bg-[#181818]'
            }`}
          >
            My Tickets
          </Link>
          <Link
            to="/agent"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
              isActive('/agent') ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-300 hover:bg-[#181818]'
            }`}
          >
            Agent Cockpit
          </Link>
          <Link
            to="/chat?demo=payment"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-center px-4 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 text-white"
          >
            Launch Demo Flow
          </Link>
        </div>
      )}
    </nav>
  );
};
