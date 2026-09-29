import React from 'react';
import { UserCheck, ShieldAlert, ArrowRight } from 'lucide-react';

export default function EscalationBanner({ session, onManualEscalate }) {
  if (session?.escalated) {
    return (
      <div className="escalation-banner">
        <div className="escalation-banner-content">
          <UserCheck size={18} color="#C2410C" />
          <span>
            <strong>Priority Escalation Active:</strong> Transferred to <strong>{session.escalatedTo || "David Miller"}</strong>.
            All prior context preserved.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '6px 16px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748B' }}>
      <span>Need specialized support?</span>
      <button 
        onClick={onManualEscalate}
        style={{ background: 'none', border: 'none', color: '#4F46E5', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
      >
        Request Human Lead <ArrowRight size={12} />
      </button>
    </div>
  );
}
