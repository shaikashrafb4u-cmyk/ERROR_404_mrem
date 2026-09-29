import React from 'react';
import { 
  ShieldAlert, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  BarChart3, 
  Sparkles,
  UserCheck
} from 'lucide-react';

export default function Header({ 
  session, 
  currentSentiment, 
  voiceEnabled, 
  onToggleVoice, 
  onResetChat, 
  onOpenAdmin 
}) {
  const isEscalated = session?.escalated;
  const agentName = isEscalated ? (session.escalatedTo || "David Miller") : "Clara";
  const agentTitle = isEscalated ? "Senior Resolution Lead (Tier 2)" : "Senior Customer Advocate";

  return (
    <header className="chat-header">
      <div className="agent-profile">
        <div className="avatar-wrapper">
          <div className={`agent-avatar ${isEscalated ? 'escalated' : ''}`}>
            {isEscalated ? <UserCheck size={22} /> : "CV"}
          </div>
          <span className="online-dot" title="Agent is active and ready" />
        </div>
        <div className="agent-info">
          <h3>
            {agentName}
            {isEscalated ? (
              <span className="sentiment-badge Concerned" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                Escalated
              </span>
            ) : (
              <span title="Human-like AI with verified empathy" style={{ display: 'inline-flex', alignItems: 'center' }}>
                <Sparkles size={13} color="#4F46E5" />
              </span>
            )}
          </h3>
          <p>{agentTitle} • Typically replies instantly</p>
        </div>
      </div>

      <div className="header-controls">
        {/* Sentiment Empathy Badge */}
        {currentSentiment && (
          <div 
            className={`sentiment-badge ${currentSentiment.label || 'Neutral'}`}
            title={`Empathy Score: ${currentSentiment.score}`}
          >
            <span>Mood: {currentSentiment.label}</span>
          </div>
        )}

        {/* Audio Toggle */}
        <button 
          className="btn btn-ghost btn-icon" 
          onClick={onToggleVoice}
          title={voiceEnabled ? "Mute agent voice" : "Enable agent voice"}
        >
          {voiceEnabled ? <Volume2 size={18} color="#4F46E5" /> : <VolumeX size={18} />}
        </button>

        {/* Reset Chat */}
        <button 
          className="btn btn-ghost btn-icon" 
          onClick={onResetChat}
          title="Restart Conversation"
        >
          <RotateCcw size={17} />
        </button>

        {/* Admin Dashboard */}
        <button 
          className="btn btn-secondary" 
          onClick={onOpenAdmin}
          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
        >
          <BarChart3 size={15} />
          <span className="btn-label">Live Admin</span>
        </button>
      </div>
    </header>
  );
}
