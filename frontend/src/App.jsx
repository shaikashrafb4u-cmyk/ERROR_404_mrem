import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import EscalationBanner from './components/EscalationBanner';
import AdminDashboard from './components/AdminDashboard';
import { sendChatMessage, fetchSession, resetSession, requestEscalation } from './services/api';
import { voiceService } from './services/voice';
import { ShieldCheck, Sparkles, MessageSquareHeart } from 'lucide-react';

export default function App() {
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem('haven_session_id') || `sess_${Date.now()}`;
  });

  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentSentiment, setCurrentSentiment] = useState({ score: 0, label: 'Neutral' });
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');

  // Initialize or fetch session
  useEffect(() => {
    localStorage.setItem('haven_session_id', sessionId);
    loadSession(sessionId);
  }, [sessionId]);

  async function loadSession(id) {
    try {
      const data = await fetchSession(id);
      setSession(data);
      setMessages(data.messages || []);
    } catch (err) {
      console.warn("Initializing fresh session on first start...");
      setMessages([
        {
          id: `msg_welcome_${Date.now()}`,
          role: "agent",
          sender: "Clara",
          text: "Hi there! I'm Clara from Customer Support. How can I help you today?",
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }

  // Handle sending a message
  const handleSendMessage = async (text) => {
    // 1. Immediately append user's message to UI
    const tempUserMsg = {
      id: `user_${Date.now()}`,
      role: 'user',
      sender: session?.customer?.name || "Customer",
      text,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsTyping(true);

    try {
      // 2. Call backend
      const response = await sendChatMessage({
        sessionId,
        message: text,
        apiKey: apiKey || undefined
      });

      // Natural human-like variable delay before showing reply (800ms - 1400ms)
      const delay = Math.min(1400, Math.max(800, text.length * 20));
      setTimeout(() => {
        setIsTyping(false);

        // Update state
        setSession(response.session);
        setCurrentSentiment(response.sentiment);

        const agentMsg = {
          ...response.agentReply,
          matchedOrder: response.matchedOrder
        };

        setMessages((prev) => [...prev, agentMsg]);

        // Speak response if voice is enabled
        if (voiceEnabled) {
          voiceService.speak(response.agentReply.text);
        }
      }, delay);

    } catch (error) {
      console.error("Chat error:", error);
      setIsTyping(false);
      const fallbackErrorMsg = {
        id: `err_${Date.now()}`,
        role: 'agent',
        sender: 'Clara',
        text: "I'm having a slight connectivity hiccup on my end, but I'm right here with you! Could you please try that one more time?",
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, fallbackErrorMsg]);
    }
  };

  // Handle voice speech-to-text
  const handleToggleListen = () => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
    } else {
      voiceService.startListening({
        onResult: (transcript) => {
          setIsListening(false);
          if (transcript && transcript.trim()) {
            handleSendMessage(transcript);
          }
        },
        onError: () => setIsListening(false),
        onEnd: () => setIsListening(false)
      });
      setIsListening(true);
    }
  };

  const handleToggleVoice = () => {
    const nextState = !voiceEnabled;
    setVoiceEnabled(nextState);
    voiceService.toggleVoice(nextState);
  };

  const handleResetChat = async () => {
    try {
      voiceService.stopSpeaking();
      const res = await resetSession(sessionId);
      setSession(res.session);
      setMessages(res.session.messages);
      setCurrentSentiment({ score: 0, label: 'Neutral' });
    } catch (e) {
      console.error("Reset error:", e);
      // Generate new session ID as fallback
      const newId = `sess_${Date.now()}`;
      setSessionId(newId);
    }
  };

  const handleManualEscalate = async () => {
    try {
      const res = await requestEscalation(sessionId, "Customer requested direct transfer to Tier 2 specialist");
      setSession(res.session);
      setMessages((prev) => [...prev, res.transferMessage]);
      if (voiceEnabled) {
        voiceService.speak(res.transferMessage.text);
      }
    } catch (e) {
      console.error("Escalation error:", e);
    }
  };

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  return (
    <div className="app-wrapper">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="brand">
          <div className="brand-icon">
            <MessageSquareHeart size={20} />
          </div>
          <span>SupportHaven</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748B', marginLeft: '4px' }}>
            Human-Like AI Experience
          </span>
        </div>

        <div className="nav-actions">
          <span 
            className="sentiment-badge Positive" 
            style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <ShieldCheck size={13} /> Active Empathetic Engine
          </span>
        </div>
      </nav>

      {/* Main Support Chat Window */}
      <main className="main-content">
        <div className="chat-card">
          <Header
            session={session}
            currentSentiment={currentSentiment}
            voiceEnabled={voiceEnabled}
            onToggleVoice={handleToggleVoice}
            onResetChat={handleResetChat}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />

          <EscalationBanner 
            session={session}
            onManualEscalate={handleManualEscalate}
          />

          <MessageList
            messages={messages}
            isTyping={isTyping}
            agentName={session?.escalated ? session?.escalatedTo : "Clara"}
          />

          <MessageInput
            onSend={handleSendMessage}
            disabled={isTyping}
            isListening={isListening}
            onToggleListen={handleToggleListen}
            isMicSupported={voiceService.isSpeechRecognitionSupported()}
          />
        </div>
      </main>

      {/* Admin & Telemetry Modal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />
    </div>
  );
}
