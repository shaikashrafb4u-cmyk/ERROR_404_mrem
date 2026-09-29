import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Database,
  Terminal,
  Activity,
  UserCheck,
  Building2,
  CreditCard,
  Truck,
  HeartPulse,
  Laptop
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/15 via-indigo-600/5 to-transparent blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-6 backdrop-blur-sm animate-pulse-subtle">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="w-1 h-1 rounded-full bg-blue-400" />
          <span className="text-zinc-300">Ready Out-Of-The-Box</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          Support that{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
            understands.
          </span>{' '}
          Resolves.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
            Remembers.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
          Nexura AI replaces frustrating generic chatbots with an autonomous complaint intelligence engine.
          It classifies customer pain points, calculates urgency, automatically creates tickets, and escalates
          to human teams seamlessly.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/chat"
            className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-500/25 transition-all flex items-center gap-2 group"
          >
            <Bot className="w-4 h-4" />
            <span>Start Customer Chat</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/chat?demo=payment"
            className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-[#181818] hover:bg-[#202020] text-zinc-200 border border-[#2E2E2E] hover:border-zinc-500 transition-all flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Launch Payment Demo</span>
          </Link>

          <Link
            to="/agent"
            className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-[#141414] hover:bg-[#1C1C1C] text-purple-300 border border-purple-500/30 hover:border-purple-500/50 transition-all flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Support Cockpit</span>
          </Link>
        </div>

        {/* Interactive Simulation Hero Banner */}
        <div className="mt-16 max-w-4xl mx-auto bg-[#121212] border border-[#262626] rounded-2xl p-6 shadow-2xl text-left relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
              <span className="text-xs font-mono text-zinc-400 ml-2">Nexura AI Complaint Intelligence Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs text-emerald-400 font-mono">Live Demo Pipeline</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left: Input */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider">
                1. Incoming Customer Message
              </span>
              <div className="p-4 rounded-xl bg-[#181818] border border-[#2A2A2A] text-sm text-zinc-200">
                “My payment of <strong className="text-emerald-400">$149.99</strong> was deducted from my card, but my order #ORD-9821 was not placed.”
              </div>

              <div className="flex items-center gap-2 text-xs text-blue-400 pt-2 font-mono">
                <Cpu className="w-4 h-4 animate-spin text-blue-400" />
                <span>Deep Intent Extraction in 12ms...</span>
              </div>
            </div>

            {/* Right: AI Output */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider">
                2. Autonomous Structured Action
              </span>
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/25 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Generated Ticket:</span>
                  <span className="text-blue-400 font-bold">CS-2026-10482</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Classification:</span>
                  <span className="text-white">Payment Issue</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Priority:</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">High</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Department:</span>
                  <span className="text-indigo-300">Billing & Finance</span>
                </div>
                <div className="pt-2 border-t border-[#262626] text-zinc-400">
                  <span className="text-blue-400">Next Action:</span> Auto-query Stripe gateway reconciliation
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-16 bg-[#0E0E0E] border-y border-[#202020]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
              The Problem We Are Solving
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Why Traditional Support Systems Fail Customers
            </h3>
            <p className="mt-3 text-sm text-zinc-400">
              Customers are frustrated by endless FAQ menus, static chatbots that fail to understand context,
              and having to repeat their situation over and over.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#141414] border border-[#242424] hover:border-red-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Endless Waiting & Queue Times</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Customers wait in queue for hours just for a human agent to ask for basic details that an intelligent
                system should have gathered upfront.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#141414] border border-[#242424] hover:border-amber-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Frustrating Repetition</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Transferring between bot, tier 1, and billing forces customers to repeat their order number,
                bank deduction, and issue history multiple times.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#141414] border border-[#242424] hover:border-blue-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Disjointed Ticket Creation</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Most chatbots provide answers but cannot autonomously generate verified ticket dossiers, calculate
                urgency, or assign the correct department.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Innovation: Workflow Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
            The Nexura Innovation
          </h2>
          <h3 className="text-3xl font-extrabold text-white">
            Complaint Intelligence + Auto-Ticket + Smart Escalation
          </h3>
          <p className="mt-3 text-sm text-zinc-400">
            A cohesive 10-stage autonomous cycle ensuring customer complaints are analyzed, resolved,
            or escalated with full context preserved.
          </p>
        </div>

        {/* 10 Step Flow Visual Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { step: '01', title: 'Customer Message', desc: 'Natural language input in any format' },
            { step: '02', title: 'Intent Detection', desc: 'Identifies core problem semantics' },
            { step: '03', title: 'Complaint Recognition', desc: 'Differentiates queries vs complaints' },
            { step: '04', title: 'Category Classification', desc: '10 enterprise-grade categories' },
            { step: '05', title: 'Priority Detection', desc: 'Calculates Low to Critical severity' },
            { step: '06', title: 'Entity Extraction', desc: 'Pulls amounts, order IDs, and dates' },
            { step: '07', title: 'Ticket Generation', desc: 'Instantly generates unique CS-ID' },
            { step: '08', title: 'Department Routing', desc: 'Dispatches to Finance, Tech, etc.' },
            { step: '09', title: 'Smart Escalation', desc: 'Hands off critical cases to humans' },
            { step: '10', title: 'Feedback Loop', desc: 'Captures CSAT ratings & metrics' },
          ].map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-[#141414] border border-[#242424] hover:border-blue-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono font-bold text-blue-400">STAGE {item.step}</span>
                <h4 className="text-sm font-semibold text-white mt-1 mb-1">{item.title}</h4>
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Industries */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#202020]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
              Enterprise Adaptability
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Built for High-Volume Industries
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#141414] border border-[#242424] flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-blue-400 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">FinTech & Banking</h4>
                <p className="text-[11px] text-zinc-400">Payment disputes, chargebacks</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#141414] border border-[#242424] flex items-center gap-3">
              <Truck className="w-6 h-6 text-cyan-400 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">E-Commerce & Logistics</h4>
                <p className="text-[11px] text-zinc-400">Delays, damaged goods, returns</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#141414] border border-[#242424] flex items-center gap-3">
              <Laptop className="w-6 h-6 text-purple-400 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">SaaS & Cloud Platforms</h4>
                <p className="text-[11px] text-zinc-400">SSO lockout, API errors, billing</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#141414] border border-[#242424] flex items-center gap-3">
              <HeartPulse className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">Telehealth & Services</h4>
                <p className="text-[11px] text-zinc-400">Urgent appointment escalation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">
          Architected on Industry Standard Technologies
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-zinc-300">
          <span className="px-3.5 py-2 rounded-xl bg-[#141414] border border-[#262626]">React 18</span>
          <span className="px-3.5 py-2 rounded-xl bg-[#141414] border border-[#262626]">TypeScript</span>
          <span className="px-3.5 py-2 rounded-xl bg-[#141414] border border-[#262626]">Vite</span>
          <span className="px-3.5 py-2 rounded-xl bg-[#141414] border border-[#262626]">Tailwind CSS</span>
          <span className="px-3.5 py-2 rounded-xl bg-[#141414] border border-[#262626]">Node.js & Express</span>
          <span className="px-3.5 py-2 rounded-xl bg-[#141414] border border-[#262626]">MongoDB / Mongoose</span>
          <span className="px-3.5 py-2 rounded-xl bg-[#141414] border border-[#262626]">Gemini LLM API</span>
          <span className="px-3.5 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            Zero-Key Offline Demo Engine
          </span>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-gradient-to-t from-blue-900/10 to-transparent border-t border-[#202020]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Experience the Future of AI Customer Support
          </h2>
          <p className="mt-3 text-zinc-400 text-sm">
            Launch the interactive customer chat now to see instant complaint understanding and ticket generation in action.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/chat"
              className="px-6 py-3 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all"
            >
              Start Free Customer Session
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
