import React from 'react';
import { CreditCard, Clock, RotateCcw, PackageX, KeyRound, ShieldAlert } from 'lucide-react';

interface QuickPromptsProps {
  onSelectPrompt: (promptText: string) => void;
  disabled?: boolean;
}

export const QuickPrompts: React.FC<QuickPromptsProps> = ({ onSelectPrompt, disabled }) => {
  const prompts = [
    {
      title: 'Payment Deducted',
      text: 'My payment was deducted but my order was not placed.',
      icon: CreditCard,
      badge: 'High Priority',
      badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    },
    {
      title: 'Delayed Delivery',
      text: 'My order is delayed past estimated delivery date.',
      icon: Clock,
      badge: 'Order Tracking',
      badgeColor: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    },
    {
      title: 'Pending Refund',
      text: 'I requested a refund last week but haven’t received it.',
      icon: RotateCcw,
      badge: 'Finance',
      badgeColor: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
    },
    {
      title: 'Wrong Item Received',
      text: 'I received the wrong product in my package.',
      icon: PackageX,
      badge: 'Fulfillment',
      badgeColor: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    },
    {
      title: 'Login Lockout',
      text: 'I cannot log into my account despite entering correct credentials.',
      icon: KeyRound,
      badge: 'Auth Help',
      badgeColor: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20',
    },
    {
      title: 'Suspicious Activity',
      text: 'There is a suspicious transaction on my account that I did not authorize.',
      icon: ShieldAlert,
      badge: 'Critical Escalation',
      badgeColor: 'text-red-400 bg-red-400/10 border-red-400/20',
    },
  ];

  return (
    <div className="w-full">
      <div className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider flex items-center justify-between">
        <span>Instant Demo Scenarios</span>
        <span className="text-[11px] font-normal text-zinc-500 lowercase">click to test AI intelligence</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {prompts.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => onSelectPrompt(item.text)}
              className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-[#242424] hover:border-blue-500/40 text-left transition-all group disabled:opacity-50 disabled:pointer-events-none"
            >
              <div className="w-7 h-7 rounded-lg bg-[#1E1E1E] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Icon className="w-3.5 h-3.5 text-zinc-300 group-hover:text-blue-400 transition-colors" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
                    {item.title}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-1 group-hover:text-zinc-300">
                  {item.text}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
