// Sentiment Analysis & Human Escalation Detection Service

const POSITIVE_WORDS = [
  "great", "awesome", "excellent", "love", "thanks", "thank you", "perfect",
  "helpful", "appreciate", "wonderful", "amazing", "good", "fast", "friendly",
  "super", "happy", "glad", "solved"
];

const CONCERN_WORDS = [
  "late", "delayed", "where is", "slow", "confused", "wondering", "problem",
  "issue", "not working", "broken", "mistake", "wrong item", "damaged"
];

const FRUSTRATED_WORDS = [
  "angry", "mad", "upset", "terrible", "horrible", "awful", "unacceptable",
  "ridiculous", "scam", "worst", "waste of money", "waste of time", "furious",
  "disaster", "hate", "chargeback", "sue", "lawyer", "liar", "garbage", "trash"
];

const ESCALATION_PHRASES = [
  "speak to a human", "speak to human", "real person", "human agent",
  "talk to a human", "live agent", "talk to someone", "customer service rep",
  "representative", "manager", "operator", "supervisor", "escalate",
  "transfer me", "real human", "speak to a person"
];

export function analyzeSentiment(text, history = []) {
  if (!text) {
    return { score: 0, label: "Neutral", escalationTriggered: false, reason: null };
  }

  const lower = text.toLowerCase();
  
  // 1. Check for explicit escalation requests
  const explicitEscalation = ESCALATION_PHRASES.some(phrase => lower.includes(phrase));
  if (explicitEscalation) {
    return {
      score: -0.6,
      label: "Frustrated",
      escalationTriggered: true,
      reason: "Customer explicitly requested a live human specialist."
    };
  }

  // 2. Count weighted sentiment tokens
  let score = 0;
  
  POSITIVE_WORDS.forEach(word => {
    if (lower.includes(word)) score += 0.25;
  });

  CONCERN_WORDS.forEach(word => {
    if (lower.includes(word)) score -= 0.2;
  });

  let extremeCount = 0;
  FRUSTRATED_WORDS.forEach(word => {
    if (lower.includes(word)) {
      score -= 0.45;
      extremeCount++;
    }
  });

  // Check punctuation intensity (e.g. ALL CAPS or excessive exclamation marks)
  if (text.length > 8 && text === text.toUpperCase() && /[A-Z]/.test(text)) {
    score -= 0.3;
    extremeCount++;
  }
  if (/!{2,}|\?{2,}/.test(text)) {
    score -= 0.15;
  }

  // Clamp score between -1 and 1
  score = Math.max(-1, Math.min(1, Number(score.toFixed(2))));

  // Determine sentiment label
  let label = "Neutral";
  if (score >= 0.4) label = "Delighted";
  else if (score > 0.1) label = "Positive";
  else if (score <= -0.5) label = "Upset";
  else if (score < -0.1) label = "Concerned";

  // Check if escalation should trigger based on consecutive negative turns or extreme keywords
  let escalationTriggered = false;
  let reason = null;

  if (extremeCount >= 2 || score <= -0.7) {
    escalationTriggered = true;
    reason = "High emotional distress or severe frustration detected.";
  } else if (history.length >= 3) {
    // Check if the last two user messages were also negative
    const lastUserTurns = history.filter(m => m.role === "user").slice(-2);
    const consistentlyUpset = lastUserTurns.every(m => m.sentimentScore !== undefined && m.sentimentScore < -0.2);
    if (consistentlyUpset && score < -0.2) {
      escalationTriggered = true;
      reason = "Multiple consecutive unaddressed pain points detected.";
    }
  }

  return {
    score,
    label,
    escalationTriggered,
    reason
  };
}
