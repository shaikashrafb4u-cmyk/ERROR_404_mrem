import { DemoIntelligenceService, StructuredAIAnalysis } from './demoIntelligenceService';
import { TicketCategory, TicketPriority } from '../models/Ticket';

export class AIService {
  /**
   * Main AI entry point.
   * If GEMINI_API_KEY or AI_API_KEY is configured, calls the LLM endpoint.
   * Otherwise (or upon any API glitch), seamlessly falls back to Demo Mode.
   */
  public static async processCustomerMessage(
    message: string,
    history: Array<{ sender: string; text: string }> = []
  ): Promise<StructuredAIAnalysis> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;

    if (!apiKey || process.env.FORCE_DEMO_MODE === 'true') {
      return DemoIntelligenceService.analyzeMessage(message, history);
    }

    try {
      // Call Google Gemini API via official REST endpoint
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `You are Nexura AI, an elite AI Customer Support Agent with autonomous complaint intelligence.
Analyze the following customer message and conversation history. Return ONLY valid raw JSON with this exact schema without any markdown ticks:
{
  "intent": string,
  "category": "Payment Issue" | "Refund Issue" | "Order Delay" | "Wrong Product" | "Damaged Product" | "Account/Login Issue" | "Technical Issue" | "Delivery Issue" | "Fraud/Suspicious Transaction" | "General Inquiry",
  "priority": "Low" | "Medium" | "High" | "Critical",
  "summary": string,
  "requiredAction": string,
  "department": string,
  "shouldCreateTicket": boolean,
  "shouldEscalate": boolean,
  "aiResponseText": string (empathetic, concise, professional customer response),
  "extractedEntities": {
    "orderId": string or undefined,
    "transactionId": string or undefined,
    "amount": string or undefined
  }
}

Customer Message: "${message}"
Recent History: ${JSON.stringify(history.slice(-4))}`,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
        }
      );

      if (!response.ok) {
        console.warn(`[AI Service] LLM API responded with status ${response.status}. Gracefully falling back to Demo Mode.`);
        return DemoIntelligenceService.analyzeMessage(message, history);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        return DemoIntelligenceService.analyzeMessage(message, history);
      }

      const parsed: StructuredAIAnalysis = JSON.parse(rawText);
      return parsed;
    } catch (error) {
      console.warn('[AI Service] API connection error. Automatically falling back to Demo Mode:', error);
      return DemoIntelligenceService.analyzeMessage(message, history);
    }
  }
}
