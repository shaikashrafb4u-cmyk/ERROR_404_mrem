import React, { useState, useEffect } from 'react';
import { 
  X, 
  BarChart3, 
  Users, 
  ShieldAlert, 
  TrendingUp, 
  Package, 
  RefreshCw, 
  Key, 
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import { fetchAnalytics, fetchConversations, fetchOrders } from '../services/api';

export default function AdminDashboard({ isOpen, onClose, apiKey, onSaveApiKey }) {
  const [activeTab, setActiveTab] = useState('metrics'); // metrics, conversations, orders, settings
  const [analytics, setAnalytics] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [keySaved, setKeySaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  async function loadData() {
    setLoading(true);
    try {
      const [analyticsData, convosData, ordersData] = await Promise.all([
        fetchAnalytics(),
        fetchConversations(),
        fetchOrders()
      ]);
      setAnalytics(analyticsData);
      setConversations(convosData);
      setOrders(ordersData);
      if (convosData.length > 0 && !selectedConvo) {
        setSelectedConvo(convosData[0]);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSaveKey = (e) => {
    e.preventDefault();
    onSaveApiKey(inputKey);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-icon" style={{ width: '28px', height: '28px' }}>
              <BarChart3 size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>SupportHaven Admin & Analytics</h2>
              <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Live Agent Telemetry & Hackathon Inspection Portal</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="btn btn-ghost btn-icon" onClick={loadData} title="Refresh data">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button className="btn btn-ghost btn-icon" onClick={onClose} title="Close window">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '4px', padding: '0 24px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
          {[
            { id: 'metrics', label: 'KPIs & Telemetry', icon: TrendingUp },
            { id: 'conversations', label: 'Transcripts & Logs', icon: MessageSquare },
            { id: 'orders', label: 'Mock DB Explorer', icon: Package },
            { id: 'settings', label: 'AI Configuration', icon: Key }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 14px',
                  background: 'none',
                  border: 'none',
                  borderBottom: active ? '2px solid #4F46E5' : '2px solid transparent',
                  color: active ? '#4F46E5' : '#64748B',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="admin-body">
          {activeTab === 'metrics' && analytics && (
            <>
              {/* KPI Cards */}
              <div className="analytics-grid">
                <div className="kpi-card">
                  <span className="kpi-title">Total Sessions</span>
                  <span className="kpi-value">{analytics.totalSessions}</span>
                  <span className="kpi-sub">{analytics.activeSessions} currently active</span>
                </div>

                <div className="kpi-card">
                  <span className="kpi-title">Average Sentiment</span>
                  <span className="kpi-value" style={{ color: analytics.averageSentiment >= 0 ? '#10B981' : '#EF4444' }}>
                    {analytics.averageSentiment > 0 ? `+${analytics.averageSentiment}` : analytics.averageSentiment}
                  </span>
                  <span className="kpi-sub">Scale: -1.0 (Distressed) to +1.0 (Delighted)</span>
                </div>

                <div className="kpi-card">
                  <span className="kpi-title">Human Escalations</span>
                  <span className="kpi-value">{analytics.escalatedSessions}</span>
                  <span className="kpi-sub">{analytics.escalationRate} escalation rate</span>
                </div>

                <div className="kpi-card">
                  <span className="kpi-title">Resolution Speed</span>
                  <span className="kpi-value">&lt; 1.2s</span>
                  <span className="kpi-sub">Immediate empathetic triage</span>
                </div>
              </div>

              {/* Issues Breakdown */}
              <div className="admin-section">
                <h3 className="admin-section-title">Topic Classification Breakdown</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>📦 Order Tracking</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{analytics.issues.orderTracking}</div>
                  </div>
                  <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>🔄 Returns & Refunds</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{analytics.issues.returnsRefunds}</div>
                  </div>
                  <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>💔 Damaged / Defects</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{analytics.issues.damagedDefects}</div>
                  </div>
                  <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>💬 General Inquiries</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{analytics.issues.generalInquiries}</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'conversations' && (
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '16px', minHeight: '360px' }}>
              {/* Left list of sessions */}
              <div style={{ borderRight: '1px solid #E2E8F0', paddingRight: '12px', overflowY: 'auto', maxHeight: '420px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {conversations.map(c => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedConvo(c)}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: selectedConvo?.id === c.id ? '#EEF2FF' : '#F8FAFC',
                      border: selectedConvo?.id === c.id ? '1px solid #818CF8' : '1px solid #E2E8F0'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: '0.85rem' }}>
                      <span>{c.customer.name}</span>
                      {c.escalated && (
                        <span style={{ fontSize: '0.65rem', background: '#FEE2E2', color: '#DC2626', padding: '1px 5px', borderRadius: '4px' }}>
                          Escalated
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.messages[c.messages.length - 1]?.text || 'No messages'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right transcript view */}
              <div style={{ overflowY: 'auto', maxHeight: '420px', display: 'flex', flexDirection: 'column', gap: '10px', padding: '0 8px' }}>
                {selectedConvo ? (
                  <>
                    <div style={{ paddingBottom: '8px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <strong>{selectedConvo.customer.name}</strong> • <span style={{ color: '#64748B' }}>{selectedConvo.customer.email}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Session: {selectedConvo.id}</span>
                    </div>

                    {selectedConvo.messages.map((m, idx) => (
                      <div key={idx} style={{ padding: '8px 12px', borderRadius: '8px', background: m.role === 'user' ? '#EEF2FF' : '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                          <span>{m.sender || (m.role === 'user' ? 'Customer' : 'Clara')}</span>
                          <span>{new Date(m.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div>{m.text}</div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div style={{ color: '#64748B', textAlign: 'center', marginTop: '40px' }}>Select a conversation to view transcript</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="admin-section">
              <h3 className="admin-section-title">Mock Warehouse & Order Fulfillment Database</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                These are the mock order records that Clara searches and reasons over in real-time when customers ask about tracking or returns.
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Item</th>
                      <th>Status</th>
                      <th>Carrier & Tracking</th>
                      <th>Est. Delivery</th>
                      <th>Return Window</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.orderId}>
                        <td><strong>#{o.orderId}</strong></td>
                        <td>{o.customerName}</td>
                        <td>{o.items[0]?.name}</td>
                        <td>
                          <span className={`order-status-badge ${o.status}`}>{o.status}</span>
                        </td>
                        <td>{o.carrier} ({o.trackingNumber})</td>
                        <td>{o.estimatedDelivery || o.deliveredDate}</td>
                        <td>{o.eligibleForReturn ? '✅ Within 30 days' : '❌ Expired'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="admin-section" style={{ maxWidth: '600px' }}>
              <h3 className="admin-section-title">Gemini LLM Engine Configuration</h3>
              <p style={{ fontSize: '0.825rem', color: '#64748B' }}>
                SupportHaven operates seamlessly with full conversational intelligence even without an API key using our built-in empathetic dialogue model. To connect your live Google Gemini Flash model, paste your key below:
              </p>

              <form onSubmit={handleSaveKey} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                    Google Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="AIzaSy..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>
                    Save & Activate Gemini
                  </button>
                  {keySaved && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16A34A', fontSize: '0.825rem', fontWeight: 600 }}>
                      <CheckCircle2 size={16} /> Key saved and activated!
                    </span>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
