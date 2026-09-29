import React, { useState } from 'react';
import { Send, Mic, MicOff, Sparkles, HelpCircle } from 'lucide-react';

const SUGGESTIONS = [
  { label: "📦 Track order #ORD-9482", text: "Where is my order ORD-9482?" },
  { label: "⚡ Check order #ORD-8219", text: "What is the status of my order ORD-8219?" },
  { label: "💔 Damaged item arrived", text: "My headphones arrived completely cracked and damaged! What do I do?" },
  { label: "🔄 Return policy question", text: "Can you explain your 30-day return policy?" },
  { label: "😡 Frustrated: Need manager", text: "This is completely ridiculous! I demand to speak with a human manager immediately." }
];

export default function MessageInput({ 
  onSend, 
  disabled, 
  isListening, 
  onToggleListen, 
  isMicSupported 
}) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
  };

  const handleChipClick = (suggestionText) => {
    if (disabled) return;
    onSend(suggestionText);
  };

  return (
    <div>
      {/* Quick Action Suggestion Chips */}
      <div className="quick-chips-container">
        {SUGGESTIONS.map((chip, idx) => (
          <button 
            key={idx} 
            className="quick-chip"
            onClick={() => handleChipClick(chip.text)}
            disabled={disabled}
            type="button"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="input-area">
        <div className="input-wrapper">
          <input
            type="text"
            className="chat-input"
            placeholder={isListening ? "Listening... speak now..." : "Type your message or question..."}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={disabled}
            autoFocus
          />

          {isMicSupported && (
            <button
              type="button"
              className={`mic-btn-inside ${isListening ? 'listening' : ''}`}
              onClick={onToggleListen}
              title={isListening ? "Stop listening" : "Click to speak"}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          )}
        </div>

        <button 
          type="submit" 
          className="send-btn" 
          disabled={!text.trim() || disabled}
          title="Send message"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
