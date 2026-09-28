import { TicketCategory, TicketPriority } from '../models/Ticket';

export interface StructuredAIAnalysis {
  intent: string;
  category: TicketCategory;
  priority: TicketPriority;
  summary: string;
  requiredAction: string;
  department: string;
  shouldCreateTicket: boolean;
  shouldEscalate: boolean;
  aiResponseText: string;
  extractedEntities: {
    orderId?: string;
    transactionId?: string;
    amount?: string;
    date?: string;
    productName?: string;
  };
}

export class DemoIntelligenceService {
  /**
   * Analyzes customer message and returns structured complaint intelligence
   */
  public static analyzeMessage(message: string, conversationHistory: Array<{ sender: string; text: string }> = []): StructuredAIAnalysis {
    const text = message.toLowerCase().trim();

    // Entity extraction patterns (e.g. #ORD-1234, $99.99, TXN-...)
    const orderIdMatch = message.match(/(?:order\s*#?|#)([A-Z0-9-]{5,12})/i);
    const txnMatch = message.match(/(?:txn|transaction|ref)\s*#?([A-Z0-9-]{6,16})/i);
    const amountMatch = message.match(/(\$\s*\d+(?:\.\d{2})?|\d+\s*(?:dollars|usd|rs|inr|eur))/i);

    const extractedEntities = {
      orderId: orderIdMatch ? orderIdMatch[1] : undefined,
      transactionId: txnMatch ? txnMatch[1] : undefined,
      amount: amountMatch ? amountMatch[0] : undefined,
    };

    // Scenario 1: Payment Deducted but Order Failed
    if (
      (text.includes('payment') || text.includes('money') || text.includes('charged') || text.includes('deducted')) &&
      (text.includes('order') || text.includes('not placed') || text.includes('failed') || text.includes('not received'))
    ) {
      return {
        intent: 'payment_deducted_order_failed',
        category: 'Payment Issue',
        priority: 'High',
        summary: 'Customer reports that payment was deducted from bank/card but the order was not successfully created.',
        requiredAction: 'Verify payment gateway transaction and reconcile order inventory.',
        department: 'Billing & Finance',
        shouldCreateTicket: true,
        shouldEscalate: false,
        aiResponseText:
          "I understand how frustrating it is when money is deducted without order confirmation. I've analyzed your issue, classified it as a **High Priority Payment Issue**, and created an official support ticket. Our billing team will verify the transaction with our payment gateway and ensure either your order is confirmed or a full refund is released immediately.",
        extractedEntities,
      };
    }

    // Scenario 6: Suspicious / Fraud Transaction
    if (
      text.includes('suspicious') ||
      text.includes('fraud') ||
      text.includes('unauthorized') ||
      text.includes('hacked') ||
      text.includes('stolen')
    ) {
      return {
        intent: 'suspicious_transaction_detected',
        category: 'Fraud/Suspicious Transaction',
        priority: 'Critical',
        summary: 'Customer reported unauthorized card activity or suspicious account access.',
        requiredAction: 'Immediate credential lockdown, card token revocation, and level-3 fraud investigation.',
        department: 'Security & Trust',
        shouldCreateTicket: true,
        shouldEscalate: true,
        aiResponseText:
          "⚠️ **Urgent Security Action**: I have flagged this as a **Critical Security Incident**. I've immediately locked unauthorized sessions and escalated this ticket directly to our **Security & Trust Specialist Team**. A senior security officer is reviewing your account activity right now.",
        extractedEntities,
      };
    }

    // Scenario 3: Refund Issue
    if (text.includes('refund') || text.includes('money back') || text.includes('reimburse')) {
      return {
        intent: 'refund_status_inquiry',
        category: 'Refund Issue',
        priority: 'High',
        summary: 'Customer requested a refund that has not reflected within the expected processing timeline.',
        requiredAction: 'Inspect payment processor ARN reference and provide direct bank tracing code.',
        department: 'Billing & Finance',
        shouldCreateTicket: true,
        shouldEscalate: false,
        aiResponseText:
          "I completely understand your concern regarding your pending refund. I have created a **High Priority Refund Ticket** for our finance desk to look up the exact bank ARN tracking code and expedite your settlement.",
        extractedEntities,
      };
    }

    // Scenario 2: Order Delay / Delivery
    if (
      text.includes('delay') ||
      text.includes('late') ||
      text.includes('where is my order') ||
      text.includes('tracking') ||
      text.includes('delivery status') ||
      text.includes('not arrived')
    ) {
      return {
        intent: 'order_transit_delay',
        category: 'Order Delay',
        priority: 'Medium',
        summary: 'Customer package is past expected SLA delivery date or has stalled carrier tracking.',
        requiredAction: 'Contact logistics carrier for immediate transit scan and update delivery ETA.',
        department: 'Logistics & Dispatch',
        shouldCreateTicket: true,
        shouldEscalate: false,
        aiResponseText:
          "I apologize for the delivery delay. I have cataloged this under **Logistics & Dispatch** with a dedicated ticket. We are pinging our carrier distribution hub to accelerate shipment dispatch.",
        extractedEntities,
      };
    }

    // Scenario 4: Wrong Product / Damaged
    if (text.includes('wrong product') || text.includes('wrong item') || text.includes('incorrect item')) {
      return {
        intent: 'wrong_item_received',
        category: 'Wrong Product',
        priority: 'Medium',
        summary: 'Customer received a package containing mismatched items compared to order manifest.',
        requiredAction: 'Generate prepaid return shipping label and dispatch correct replacement item.',
        department: 'Fulfillment & Returns',
        shouldCreateTicket: true,
        shouldEscalate: false,
        aiResponseText:
          "I am so sorry about the mix-up with your shipment. I have generated a support ticket for **Fulfillment & Returns**. We will immediately email you a prepaid return label and dispatch the correct item right away.",
        extractedEntities,
      };
    }

    if (text.includes('damaged') || text.includes('broken') || text.includes('defective') || text.includes('cracked')) {
      return {
        intent: 'damaged_product_reported',
        category: 'Damaged Product',
        priority: 'Medium',
        summary: 'Customer received product in damaged or non-functional condition.',
        requiredAction: 'Initiate priority warranty replacement and request damage photo verification.',
        department: 'Quality Assurance & Returns',
        shouldCreateTicket: true,
        shouldEscalate: false,
        aiResponseText:
          "I'm sorry your item arrived damaged. I've created a ticket under **Quality Assurance & Returns**. You are fully covered by our buyer guarantee, and a replacement will be prepared immediately.",
        extractedEntities,
      };
    }

    // Scenario 5: Account / Login Issue
    if (
      text.includes('login') ||
      text.includes('log in') ||
      text.includes('log into') ||
      text.includes('password') ||
      text.includes('sign in') ||
      text.includes('locked out') ||
      text.includes('cannot access') ||
      text.includes('reset')
    ) {
      return {
        intent: 'account_access_difficulty',
        category: 'Account/Login Issue',
        priority: 'Medium',
        summary: 'Customer encountering authentication lockout or credentials reset difficulty.',
        requiredAction: 'Trigger secure multi-factor identity verification and clear security lock.',
        department: 'Account Security',
        shouldCreateTicket: true,
        shouldEscalate: false,
        aiResponseText:
          "I understand you are having difficulty accessing your account. I have created a ticket with our **Account Security Team** and sent a secure verification email to your registered address to restore access.",
        extractedEntities,
      };
    }

    // Technical Issue
    if (
      text.includes('bug') ||
      text.includes('error') ||
      text.includes('crash') ||
      text.includes('not working') ||
      text.includes('api') ||
      text.includes('500') ||
      text.includes('404')
    ) {
      return {
        intent: 'technical_glitch_report',
        category: 'Technical Issue',
        priority: 'Medium',
        summary: 'Customer reported an application defect or platform service error.',
        requiredAction: 'Capture client diagnostics and triage to engineering on-call queue.',
        department: 'Engineering Support',
        shouldCreateTicket: true,
        shouldEscalate: false,
        aiResponseText:
          "Thank you for reporting this technical glitch. I've logged the error details into an **Engineering Support** ticket with diagnostics attached for our dev team to review.",
        extractedEntities,
      };
    }

    // Greetings & Casual Queries
    if (
      text.startsWith('hi') ||
      text.startsWith('hello') ||
      text.startsWith('hey') ||
      text.includes('good morning') ||
      text.includes('good evening')
    ) {
      return {
        intent: 'greeting',
        category: 'General Inquiry',
        priority: 'Low',
        summary: 'Customer initiated general support chat.',
        requiredAction: 'Inquire how Nexura AI can assist with orders, payments, or account issues.',
        department: 'General Support',
        shouldCreateTicket: false,
        shouldEscalate: false,
        aiResponseText:
          "Hello! I am **Nexura AI**, your automated customer support specialist. I can help resolve payment deductions, delayed deliveries, refunds, account issues, or escalate complex matters directly to our team. How can I help you today?",
        extractedEntities,
      };
    }

    // Escalation Trigger Words
    if (text.includes('human') || text.includes('agent') || text.includes('speak to a person') || text.includes('representative')) {
      return {
        intent: 'request_human_specialist',
        category: 'General Inquiry',
        priority: 'High',
        summary: 'Customer specifically requested hand-off to a live human representative.',
        requiredAction: 'Route to next available live agent queue with conversation context.',
        department: 'Live Operations',
        shouldCreateTicket: true,
        shouldEscalate: true,
        aiResponseText:
          "I am escalating this issue to a human support specialist right now. I have created an urgent ticket and forwarded your conversation history so you will not have to repeat yourself.",
        extractedEntities,
      };
    }

    // Fallback: Smart General Inquiry with Auto Ticket
    return {
      intent: 'general_support_request',
      category: 'General Inquiry',
      priority: 'Medium',
      summary: `Customer inquiry regarding: "${message.substring(0, 80)}..."`,
      requiredAction: 'Review inquiry and assign to suitable team member.',
      department: 'Customer Care',
      shouldCreateTicket: true,
      shouldEscalate: false,
      aiResponseText:
        "I have documented your issue in detail and initiated a dedicated support ticket. Our Customer Care team has been notified and is reviewing your request.",
      extractedEntities,
    };
  }
}
