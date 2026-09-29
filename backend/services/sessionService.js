// Session Management & Conversation Context Service

class SessionService {
  constructor() {
    this.sessions = new Map();
  }

  getOrCreateSession(sessionId) {
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }

    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        id: sessionId,
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        customer: {
          name: "Sarah Jenkins",
          email: "sarah.j@example.com",
          tier: "Gold Member (Customer since 2023)"
        },
        messages: [
          {
            id: `msg_welcome_${Date.now()}`,
            role: "agent",
            sender: "Clara",
            text: "Hi there! I'm Clara from Customer Support. How can I help you today?",
            timestamp: new Date().toISOString(),
            sentiment: "Neutral"
          }
        ],
        status: "active", // active, escalated, resolved
        escalated: false,
        escalationReason: null,
        escalatedTo: null,
        mentionedOrders: [],
        metrics: {
          sentimentScores: [0]
        }
      });
    }

    return this.sessions.get(sessionId);
  }

  addMessage(sessionId, messageData) {
    const session = this.getOrCreateSession(sessionId);
    session.lastActiveAt = new Date().toISOString();

    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...messageData
    };

    session.messages.push(message);

    if (messageData.sentimentScore !== undefined) {
      session.metrics.sentimentScores.push(messageData.sentimentScore);
    }

    if (messageData.orderId && !session.mentionedOrders.includes(messageData.orderId)) {
      session.mentionedOrders.push(messageData.orderId);
    }

    return message;
  }

  escalateSession(sessionId, reason, agentName = "David Miller") {
    const session = this.getOrCreateSession(sessionId);
    session.status = "escalated";
    session.escalated = true;
    session.escalationReason = reason;
    session.escalatedTo = agentName;
    return session;
  }

  resetSession(sessionId) {
    this.sessions.delete(sessionId);
    return this.getOrCreateSession(sessionId);
  }

  getAllSessions() {
    return Array.from(this.sessions.values()).sort(
      (a, b) => new Date(b.lastActiveAt) - new Date(a.lastActiveAt)
    );
  }

  getAnalytics() {
    const all = this.getAllSessions();
    const totalSessions = all.length;
    const escalatedSessions = all.filter(s => s.escalated).length;
    
    // Average sentiment across all messages
    let totalScore = 0;
    let scoreCount = 0;
    all.forEach(s => {
      s.metrics.sentimentScores.forEach(sc => {
        totalScore += sc;
        scoreCount++;
      });
    });

    const averageSentiment = scoreCount > 0 ? (totalScore / scoreCount).toFixed(2) : "0.00";
    
    // Issue categories breakdown (scanned from messages)
    const issues = {
      orderTracking: 0,
      returnsRefunds: 0,
      damagedDefects: 0,
      generalInquiries: 0
    };

    all.forEach(s => {
      const texts = s.messages.map(m => m.text.toLowerCase()).join(" ");
      if (texts.includes("track") || texts.includes("where") || texts.includes("delivery") || texts.includes("ship")) {
        issues.orderTracking++;
      }
      if (texts.includes("return") || texts.includes("refund") || texts.includes("money back")) {
        issues.returnsRefunds++;
      }
      if (texts.includes("damage") || texts.includes("broken") || texts.includes("defect") || texts.includes("wrong")) {
        issues.damagedDefects++;
      }
      if (texts.includes("warranty") || texts.includes("discount") || texts.includes("hours") || texts.includes("price")) {
        issues.generalInquiries++;
      }
    });

    return {
      totalSessions,
      activeSessions: all.filter(s => s.status === "active").length,
      escalatedSessions,
      escalationRate: totalSessions > 0 ? `${Math.round((escalatedSessions / totalSessions) * 100)}%` : "0%",
      averageSentiment: Number(averageSentiment),
      issues,
      recentSessions: all.slice(0, 10).map(s => ({
        id: s.id,
        customerName: s.customer.name,
        messagesCount: s.messages.length,
        status: s.status,
        lastActiveAt: s.lastActiveAt,
        escalated: s.escalated,
        lastSnippet: s.messages[s.messages.length - 1]?.text?.substring(0, 80) || ""
      }))
    };
  }
}

export const sessionService = new SessionService();
