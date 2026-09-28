import { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/aiService';
import { TicketService } from '../services/ticketService';
import { memoryStore } from '../models/memoryStore';
import { Conversation } from '../models/Conversation';
import { isMongoConnected } from '../config/database';

export const handleChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, sessionId = 'sess_' + Date.now(), customerId = 'CUST-DEMO-01', history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ success: false, message: 'Message text is required.' });
      return;
    }

    // Step 1: AI Complaint Intelligence & Intent Detection
    const analysis = await AIService.processCustomerMessage(message, history);

    let createdTicket = null;

    // Step 2: Automatic Ticket Creation if issue detected
    if (analysis.shouldCreateTicket) {
      createdTicket = await TicketService.createTicket({
        category: analysis.category,
        priority: analysis.priority,
        title: analysis.summary.length > 50 ? analysis.summary.substring(0, 47) + '...' : analysis.summary,
        description: message,
        summary: analysis.summary,
        department: analysis.department,
        customerId,
        recommendedAction: analysis.requiredAction,
        extractedEntities: analysis.extractedEntities,
        shouldEscalate: analysis.shouldEscalate,
      });
    }

    // Step 3: Record Customer & AI Messages in conversation store
    const customerMsg = {
      id: 'msg_c_' + Date.now(),
      sender: 'customer' as const,
      text: message,
      timestamp: new Date(),
    };

    const aiMsg = {
      id: 'msg_a_' + (Date.now() + 1),
      sender: 'ai' as const,
      text: analysis.aiResponseText,
      timestamp: new Date(),
      structuredData: {
        intent: analysis.intent,
        category: analysis.category,
        priority: analysis.priority,
        summary: analysis.summary,
        requiredAction: analysis.requiredAction,
        ticketId: createdTicket ? createdTicket.ticketId : undefined,
        shouldCreateTicket: analysis.shouldCreateTicket,
        shouldEscalate: analysis.shouldEscalate,
      },
    };

    if (isMongoConnected) {
      let convo = await Conversation.findOne({ sessionId });
      if (!convo) {
        convo = new Conversation({ sessionId, customerId, messages: [customerMsg, aiMsg] });
      } else {
        convo.messages.push(customerMsg, aiMsg);
      }
      await convo.save();
    } else {
      await memoryStore.saveMessage(sessionId, customerMsg, customerId);
      await memoryStore.saveMessage(sessionId, aiMsg, customerId);
    }

    res.status(200).json({
      success: true,
      sessionId,
      reply: analysis.aiResponseText,
      analysis: {
        intent: analysis.intent,
        category: analysis.category,
        priority: analysis.priority,
        summary: analysis.summary,
        requiredAction: analysis.requiredAction,
        department: analysis.department,
        shouldCreateTicket: analysis.shouldCreateTicket,
        shouldEscalate: analysis.shouldEscalate,
        extractedEntities: analysis.extractedEntities,
      },
      ticket: createdTicket,
    });
  } catch (error) {
    next(error);
  }
};
