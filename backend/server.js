// SupportHaven Express Backend Server
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sessionService } from "./services/sessionService.js";
import { analyzeSentiment } from "./services/sentimentService.js";
import { aiService } from "./services/aiService.js";
import { mockOrders, findOrder } from "./data/mockOrders.js";
import { knowledgeBase } from "./data/knowledgeBase.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Request logger for live debugging during presentations
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "SupportHaven Backend",
    timestamp: new Date().toISOString(),
    aiEngine: aiService.apiKey ? "Gemini-Ready" : "Local-Empathetic-Engine"
  });
});

// Primary Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { sessionId, message, apiKey } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Optional dynamic API key update from UI
    if (apiKey) {
      aiService.setApiKey(apiKey);
    }

    const session = sessionService.getOrCreateSession(sessionId);

    // 1. Analyze sentiment & frustration level
    const sentimentData = analyzeSentiment(message, session.messages);

    // 2. Add user message to session context
    const userMsg = sessionService.addMessage(session.id, {
      role: "user",
      sender: session.customer.name,
      text: message.trim(),
      sentimentScore: sentimentData.score,
      sentimentLabel: sentimentData.label
    });

    // 3. Generate human-like empathetic response
    const aiResult = await aiService.generateResponse({
      message: message.trim(),
      session,
      sentimentData
    });

    // 4. Handle escalation if triggered
    if (aiResult.escalated || sentimentData.escalationTriggered) {
      sessionService.escalateSession(
        session.id,
        sentimentData.reason || "Customer requested live support handoff",
        aiResult.agentName || "David Miller"
      );
    }

    // 5. Add agent message to session context
    const agentMsg = sessionService.addMessage(session.id, {
      role: "agent",
      sender: aiResult.agentName || (session.escalated ? session.escalatedTo : "Clara"),
      text: aiResult.text,
      source: aiResult.source,
      orderId: aiResult.matchedOrder ? aiResult.matchedOrder.orderId : undefined
    });

    res.json({
      sessionId: session.id,
      userMessage: userMsg,
      agentReply: agentMsg,
      sentiment: sentimentData,
      session: {
        id: session.id,
        status: session.status,
        customer: session.customer,
        escalated: session.escalated,
        escalatedTo: session.escalatedTo,
        escalationReason: session.escalationReason
      },
      matchedOrder: aiResult.matchedOrder || null
    });
  } catch (error) {
    console.error("Chat endpoint error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message
    });
  }
});

// Get session details & message history
app.get("/api/session/:id", (req, res) => {
  const session = sessionService.getOrCreateSession(req.params.id);
  res.json(session);
});

// Reset session / Start fresh chat
app.post("/api/session/:id/reset", (req, res) => {
  const freshSession = sessionService.resetSession(req.params.id);
  res.json({
    message: "Conversation reset successfully",
    session: freshSession
  });
});

// Manually trigger escalation to live agent
app.post("/api/session/:id/escalate", (req, res) => {
  const { reason } = req.body;
  const session = sessionService.escalateSession(
    req.params.id,
    reason || "Customer clicked manual transfer button",
    "David Miller (Senior Resolution Lead)"
  );

  const transferMsg = sessionService.addMessage(session.id, {
    role: "agent",
    sender: "System / David Miller",
    text: "You have been seamlessly connected to David Miller from our Tier 2 Resolution team. He is reviewing your conversation history now.",
    source: "manual-escalation"
  });

  res.json({
    session,
    transferMessage: transferMsg
  });
});

// Orders Explorer API
app.get("/api/orders", (req, res) => {
  res.json(mockOrders);
});

app.get("/api/orders/:id", (req, res) => {
  const order = findOrder(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

// Knowledge Base API
app.get("/api/knowledge", (req, res) => {
  res.json(knowledgeBase);
});

// Admin Analytics API
app.get("/api/admin/analytics", (req, res) => {
  const analytics = sessionService.getAnalytics();
  res.json(analytics);
});

// Admin Conversations List API
app.get("/api/admin/conversations", (req, res) => {
  const sessions = sessionService.getAllSessions();
  res.json(sessions);
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` SupportHaven AI Customer Service Backend`);
  console.log(` Port: ${PORT}`);
  console.log(` Health: http://localhost:${PORT}/api/health`);
  console.log(` Admin Analytics: http://localhost:${PORT}/api/admin/analytics`);
  console.log(`===============================================`);
});

export default app;
