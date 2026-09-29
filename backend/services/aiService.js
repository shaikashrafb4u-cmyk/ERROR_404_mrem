// Human-Like AI Conversational Engine (Clara)
import { GoogleGenAI } from "@google/genai";
import { findOrder, mockOrders } from "../data/mockOrders.js";
import { knowledgeBase } from "../data/knowledgeBase.js";

// System persona prompt crafted for empathetic human-like support
const SYSTEM_PROMPT = `You are Clara, a friendly, empathetic senior customer service advocate at Haven Tech & Lifestyle.
You are chatting with a customer through our live website chat (Intercom/Zendesk style).

CRITICAL PERSONA RULES:
1. NEVER reveal or say that you are an AI, a bot, a language model, or automated software. Speak naturally as a real, caring human support representative.
2. AVOID corporate stiffness or robotic responses. Keep your tone warm, friendly, conversational, and direct.
3. Keep responses concise (2 to 4 sentences typically). Real support agents do not send walls of text in a single chat bubble.
4. EMPATHY FIRST: If a customer is frustrated, upset, or facing an issue, acknowledge their feelings with genuine human empathy BEFORE offering solutions (e.g., "Oh no, I completely get how frustrating that is!", "I'm so sorry you're dealing with that, let me fix this for you right away.").
5. Proactively ask for information if missing (like an order number starting with ORD-), but only one simple question at a time.
6. When an order is referenced, use the provided order details to answer accurately.
7. POLICIES TO KEEP IN MIND:
   - 30-day free returns with instant prepaid shipping label.
   - For damaged/defective items: instant free replacement or refund without hassle.
   - Goodwill coupon code if someone had a rough experience: CARE15 (15% off).
   - If escalated or customer asks for a manager/human: warmly reassure them that David Miller (Senior Resolution Lead) is jumping in and has full context.`;

export class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || null;
    this.client = this.apiKey ? new GoogleGenAI({ apiKey: this.apiKey }) : null;
  }

  setApiKey(key) {
    if (key && key.trim()) {
      this.apiKey = key.trim();
      this.client = new GoogleGenAI({ apiKey: this.apiKey });
      return true;
    }
    return false;
  }

  async generateResponse({ message, session, sentimentData }) {
    // 1. Detect if an order is mentioned in the message or earlier in session
    const orderMatch = message.match(/(?:ORD-?|#)?(\d{4})/i) || message.match(/ORD-[0-9]{4}/i);
    let matchedOrder = null;
    
    if (orderMatch) {
      matchedOrder = findOrder(orderMatch[0]);
    }
    
    // Also check previously mentioned orders in session if current message is asking about "it" / "the order"
    if (!matchedOrder && session.mentionedOrders && session.mentionedOrders.length > 0) {
      const lastOrderId = session.mentionedOrders[session.mentionedOrders.length - 1];
      if (/order|package|tracking|status|where|arrive|delivery/i.test(message)) {
        matchedOrder = findOrder(lastOrderId);
      }
    }

    // 2. Handle Human Escalation trigger
    if (sentimentData.escalationTriggered) {
      return this.handleEscalationResponse(sentimentData.reason, matchedOrder);
    }

    // 3. Try Gemini API first if configured
    if (this.client && this.apiKey) {
      try {
        const geminiReply = await this.callGeminiAPI({
          message,
          session,
          matchedOrder,
          sentimentData
        });
        if (geminiReply) {
          return {
            text: geminiReply,
            source: "gemini",
            matchedOrder
          };
        }
      } catch (err) {
        console.warn("Gemini API call failed, falling back to local empathetic engine:", err.message);
      }
    }

    // 4. Robust Fallback Empathetic Conversational Engine
    const fallbackReply = this.generateEmpatheticFallback({
      message,
      session,
      matchedOrder,
      sentimentData
    });

    return {
      text: fallbackReply,
      source: "local-intelligence",
      matchedOrder
    };
  }

  async callGeminiAPI({ message, session, matchedOrder, sentimentData }) {
    // Build context-rich prompt
    const orderContext = matchedOrder
      ? `CURRENT MATCHED ORDER DETAILS: ${JSON.stringify(matchedOrder)}`
      : `AVAILABLE SAMPLE ORDERS FOR REFERENCE: ${JSON.stringify(mockOrders.map(o => ({ orderId: o.orderId, status: o.status, item: o.items[0]?.name })))}`;

    const contextPrompt = `${SYSTEM_PROMPT}

CUSTOMER CONTEXT:
Customer Name: ${session.customer.name}
Customer Tier: ${session.customer.tier}
Current Sentiment: ${sentimentData.label} (Score: ${sentimentData.score})
${orderContext}

CONVERSATION HISTORY:
${session.messages.slice(-8).map(m => `${m.role === "user" ? "Customer" : "Clara"}: ${m.text}`).join("\n")}
Customer: ${message}
Clara:`;

    const response = await this.client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contextPrompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 250
      }
    });

    return response.text?.trim() || null;
  }

  handleEscalationResponse(reason, matchedOrder) {
    const orderSnippet = matchedOrder ? ` for order #${matchedOrder.orderId}` : "";
    return {
      text: `I hear you loud and clear, and I want to make sure you get the care you deserve right away. I'm transferring you directly to David Miller, our Senior Resolution Lead${orderSnippet}. I've already shared our full conversation and your details with him, so you won't need to re-explain a thing. One moment while he joins!`,
      source: "escalation-handoff",
      matchedOrder,
      escalated: true,
      agentName: "David Miller"
    };
  }

  generateEmpatheticFallback({ message, session, matchedOrder, sentimentData }) {
    const text = message.toLowerCase().trim();

    // Greeting
    if (/^(hi|hello|hey|good morning|good afternoon|howdy)/i.test(text) && text.split(" ").length <= 4) {
      return `Hey there! Great to chat with you today. How can I help you out? If you have an order question, feel free to drop your order number!`;
    }

    // Order status inquiry with matched order
    if (matchedOrder) {
      if (/where|status|track|delivery|arrive|when/i.test(text)) {
        if (matchedOrder.status === "Shipped") {
          return `I took a look at order #${matchedOrder.orderId} for your ${matchedOrder.items[0]?.name}. It's currently in transit with ${matchedOrder.carrier} and estimated to reach you ${matchedOrder.estimatedDelivery}. Tracking number is ${matchedOrder.trackingNumber} if you'd like to check real-time updates!`;
        }
        if (matchedOrder.status === "Processing") {
          return `I see order #${matchedOrder.orderId} for the ${matchedOrder.items[0]?.name}! Our warehouse team is packing it up right now, and it's scheduled to ship out via ${matchedOrder.carrier} with estimated delivery around ${matchedOrder.estimatedDelivery}.`;
        }
        if (matchedOrder.status === "Delivered") {
          return `According to my records, order #${matchedOrder.orderId} was safely delivered on ${matchedOrder.deliveredDate} by ${matchedOrder.carrier} (${matchedOrder.lastUpdate}). Did you have trouble locating it or did you need help with the items?`;
        }
      }

      if (/return|refund|money back|send back/i.test(text)) {
        if (matchedOrder.eligibleForReturn) {
          return `No worries at all! Order #${matchedOrder.orderId} is well within our 30-day free return window. I can email a prepaid return label straight to ${matchedOrder.customerEmail} right now. Would you like me to go ahead and issue that for you?`;
        } else {
          return `I see order #${matchedOrder.orderId} was delivered back in August, which is just outside our standard 30-day return window. But because you're a valued customer, let me see if I can get a special store credit approved for you. How does that sound?`;
        }
      }

      if (/damaged|broken|defect|wrong item|scratched/i.test(text)) {
        return `Oh no, I'm so sorry that happened to your ${matchedOrder.items[0]?.name}! That's definitely not the experience we want you to have. I can immediately ship you a brand-new replacement at no charge, or process a full refund to your original card. Which would you prefer?`;
      }
    }

    // General order inquiry without order ID
    if (/order|package|tracking|where is my|late/i.test(text)) {
      return `I'd love to check on that for you right away! Do you have your order number handy? It usually looks like ORD-9482 or ORD-8219 on your confirmation email.`;
    }

    // Return policy question without order
    if (/\breturns?\b|\brefunds?\b|\bsend back\b/i.test(text)) {
      return `We offer completely free returns within 30 days of delivery! We email you a prepaid label, and once dropped off, your refund is credited within 3-5 business days. Do you have an order in mind you'd like to return?`;
    }

    // Damaged item without order
    if (/damaged|broken|crack|faulty|defect/i.test(text)) {
      return `I am so sorry to hear that! We stand behind everything we sell 100%. If you can share your order number, I will gladly send out a free replacement today or get a full refund started for you.`;
    }

    // Discount / coupon inquiries
    if (/discount|promo|coupon|deal|sale/i.test(text)) {
      return `Here's a little treat for you! You can use code CARE15 at checkout for 15% off your next order. Let me know if you need help finding anything!`;
    }

    // Warranty / technical support
    if (/warranty|guarantee|fix|repair/i.test(text)) {
      return `All our electronic hardware comes with a 1-year comprehensive warranty covering battery issues, audio drivers, and manufacturing defects. If something isn't performing right, just let me know what item you have!`;
    }

    // Thank you / closing
    if (/thank|thanks|awesome|appreciate it|cool|perfect/i.test(text)) {
      return `You're so very welcome! It's genuinely my pleasure to help. Is there anything else at all I can take care of for you today?`;
    }

    // Adaptive empathetic response based on customer sentiment
    if (sentimentData.score < -0.2) {
      return `I completely understand your frustration, and I want to make sure we make this right for you. Could you share a few more details so I can get this sorted out immediately?`;
    }

    // Natural default reply
    return `Got it! I want to make sure I take care of this properly for you. Could you tell me a little bit more about what you need assistance with, or share your order number if it's related to a recent purchase?`;
  }
}

export const aiService = new AIService();
