import React, { useEffect, useRef } from 'react';
import { Package, Truck, CheckCircle2, Clock, User, CheckCheck, Sparkles } from 'lucide-react';

export default function MessageList({ messages, isTyping, agentName = "Clara" }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function formatTime(isoString) {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  }

  return (
    <div className="messages-container">
      <div className="chat-date-divider">
        <span>Today • Haven Support Chat</span>
      </div>

      {messages.map((msg, index) => {
        const isUser = msg.role === 'user';
        const isEscalatedAgent = msg.sender && msg.sender.includes("David");

        return (
          <div key={msg.id || index} className={`message-row ${isUser ? 'user' : 'agent'}`}>
            {!isUser && (
              <div 
                className={`agent-avatar ${isEscalatedAgent ? 'escalated' : ''}`}
                style={{ width: '32px', height: '32px', fontSize: '0.8rem', flexShrink: 0 }}
              >
                {isEscalatedAgent ? "DM" : "CV"}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '100%' }}>
              <div className="message-bubble">
                <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.text}</p>

                {/* Render Order Card if attached */}
                {msg.matchedOrder && (
                  <div className="order-card">
                    <div className="order-card-header">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Package size={15} color="#4F46E5" />
                        Order #{msg.matchedOrder.orderId}
                      </span>
                      <span className={`order-status-badge ${msg.matchedOrder.status}`}>
                        {msg.matchedOrder.status}
                      </span>
                    </div>
                    <div style={{ color: '#475569', fontSize: '0.775rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div><strong>Item:</strong> {msg.matchedOrder.items[0]?.name}</div>
                      <div><strong>Carrier:</strong> {msg.matchedOrder.carrier} ({msg.matchedOrder.trackingNumber})</div>
                      <div><strong>Est. Delivery:</strong> {msg.matchedOrder.estimatedDelivery || msg.matchedOrder.deliveredDate}</div>
                      <div style={{ fontSize: '0.725rem', color: '#64748B', marginTop: '2px' }}>
                        📍 {msg.matchedOrder.lastUpdate}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="message-meta">
                <span>{formatTime(msg.timestamp)}</span>
                {isUser && <CheckCheck size={14} color="#60A5FA" />}
                {!isUser && msg.source && (
                  <span className="message-source-tag">
                    {msg.source === 'gemini' ? (
                      <>
                        <Sparkles size={10} /> Gemini Powered
                      </>
                    ) : msg.source === 'escalation-handoff' ? (
                      'Priority Transfer'
                    ) : (
                      'Direct Care'
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Realistic Typing Indicator */}
      {isTyping && (
        <div className="typing-indicator-row">
          <div 
            className="agent-avatar" 
            style={{ width: '30px', height: '30px', fontSize: '0.75rem', flexShrink: 0 }}
          >
            CV
          </div>
          <div className="typing-bubble">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
          <span className="typing-text">{agentName} is typing...</span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
