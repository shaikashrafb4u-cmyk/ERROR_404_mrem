// Voice Recognition & Speech Synthesis Utilities

export class VoiceService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.recognition = null;
    this.isListening = false;
    this.voiceEnabled = true;

    // Initialize SpeechRecognition if supported
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
      }
    }
  }

  isSpeechRecognitionSupported() {
    return !!this.recognition;
  }

  startListening({ onResult, onError, onEnd }) {
    if (!this.recognition) {
      if (onError) onError(new Error("Speech recognition not supported in this browser."));
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      return;
    }

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
    };

    this.recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      if (onError) onError(event);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (e) {
      console.warn("Recognition already started or error:", e);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text) {
    if (!this.synth || !this.voiceEnabled || !text) return;

    // Cancel any ongoing speech
    this.synth.cancel();

    // Clean markdown/special characters for speech
    const cleanText = text
      .replace(/[#*_`]/g, '')
      .replace(/ORD-\d+/g, (match) => `Order ${match.replace('ORD-', '')}`)
      .replace(/https?:\/\/\S+/g, 'link');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.02; // Warm, natural human cadence
    utterance.pitch = 1.05; // Slightly pleasant friendly pitch

    // Prefer a natural-sounding English voice if available
    const voices = this.synth.getVoices();
    const naturalVoice = voices.find(v => 
      (v.name.includes("Samantha") || v.name.includes("Natural") || v.name.includes("Google US English") || v.name.includes("Jenny") || v.name.includes("Zira")) &&
      v.lang.startsWith("en")
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  toggleVoice(enabled) {
    this.voiceEnabled = enabled;
    if (!enabled) {
      this.stopSpeaking();
    }
  }
}

export const voiceService = new VoiceService();
