import { ITicket, TicketCategory, TicketPriority, TicketStatus, EscalationStatus } from './Ticket';
import { IMessage } from './Conversation';

export interface MemoryTicket {
  _id: string;
  ticketId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  category: TicketCategory;
  priority: TicketPriority;
  title: string;
  description: string;
  summary: string;
  department: string;
  status: TicketStatus;
  escalationStatus: EscalationStatus;
  recommendedAction: string;
  extractedEntities?: {
    orderId?: string;
    transactionId?: string;
    amount?: string;
    date?: string;
    productName?: string;
  };
  timeline: Array<{
    timestamp: Date;
    event: string;
    performedBy: string;
    note?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryFeedback {
  _id: string;
  ticketId: string;
  rating: number;
  comment: string;
  customerName?: string;
  createdAt: Date;
}

export interface MemoryConversation {
  _id: string;
  sessionId: string;
  customerId: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Seed initial realistic tickets for the hackathon demo so the dashboard is rich from moment 1
const initialTickets: MemoryTicket[] = [
  {
    _id: 'mem_1',
    ticketId: 'CS-2026-10480',
    customerId: 'CUST-DEMO-01',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.v@example.com',
    category: 'Payment Issue',
    priority: 'High',
    title: 'Double deduction during checkout',
    description: 'I was charged twice $149.99 for my cloud subscription renewal.',
    summary: 'Customer reports duplicate charge of $149.99 on billing renewal.',
    department: 'Billing & Finance',
    status: 'In Progress',
    escalationStatus: 'None',
    recommendedAction: 'Verify Stripe gateway transaction and reverse duplicate charge.',
    extractedEntities: {
      transactionId: 'TXN-98124',
      amount: '$149.99',
    },
    timeline: [
      {
        timestamp: new Date(Date.now() - 3600000 * 5),
        event: 'Ticket automatically created by AI Complaint Intelligence',
        performedBy: 'Nexura AI',
      },
      {
        timestamp: new Date(Date.now() - 3600000 * 2),
        event: 'Assigned to Billing & Finance queue',
        performedBy: 'System Orchestrator',
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 5),
    updatedAt: new Date(Date.now() - 3600000 * 2),
  },
  {
    _id: 'mem_2',
    ticketId: 'CS-2026-10475',
    customerId: 'CUST-DEMO-02',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.r@example.com',
    category: 'Fraud/Suspicious Transaction',
    priority: 'Critical',
    title: 'Unauthorized API token generated from foreign IP',
    description: 'Security alert noticed unexpected API secret creation at 3 AM.',
    summary: 'Suspicious credential generation detected; potential account breach.',
    department: 'Security & Trust',
    status: 'Assigned',
    escalationStatus: 'Escalated',
    recommendedAction: 'Immediate token revocation and mandatory password reset.',
    timeline: [
      {
        timestamp: new Date(Date.now() - 3600000 * 12),
        event: 'Critical Priority Ticket Created',
        performedBy: 'Nexura AI',
      },
      {
        timestamp: new Date(Date.now() - 3600000 * 11),
        event: 'Auto-escalated to Level 3 Incident Response Specialist',
        performedBy: 'Nexura AI Escalation Rule',
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 12),
    updatedAt: new Date(Date.now() - 3600000 * 11),
  },
  {
    _id: 'mem_3',
    ticketId: 'CS-2026-10460',
    customerId: 'CUST-DEMO-03',
    customerName: 'Devon Miles',
    customerEmail: 'devon.m@example.com',
    category: 'Order Delay',
    priority: 'Medium',
    title: 'Enterprise hardware delivery past estimated arrival',
    description: 'Server rack units were due Tuesday; carrier tracking status has stalled.',
    summary: 'Hardware delivery delayed past SLA timeline.',
    department: 'Logistics & Dispatch',
    status: 'Open',
    escalationStatus: 'None',
    recommendedAction: 'Check courier dispatch status and issue transit update.',
    timeline: [
      {
        timestamp: new Date(Date.now() - 3600000 * 24),
        event: 'Ticket logged from customer inquiry',
        performedBy: 'Nexura AI',
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 24),
    updatedAt: new Date(Date.now() - 3600000 * 24),
  },
  {
    _id: 'mem_4',
    ticketId: 'CS-2026-10442',
    customerId: 'CUST-DEMO-04',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@example.com',
    category: 'Account/Login Issue',
    priority: 'Low',
    title: 'SSO configuration assistance required',
    description: 'Customer needed guidance enabling Okta SAML 2.0 integration.',
    summary: 'Okta SAML integration question successfully guided.',
    department: 'Customer Success',
    status: 'Resolved',
    escalationStatus: 'None',
    recommendedAction: 'Provide SAML metadata documentation link.',
    timeline: [
      {
        timestamp: new Date(Date.now() - 3600000 * 48),
        event: 'Ticket created',
        performedBy: 'Nexura AI',
      },
      {
        timestamp: new Date(Date.now() - 3600000 * 36),
        event: 'Marked as Resolved by Agent Sarah C.',
        performedBy: 'Sarah C. (Agent)',
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 48),
    updatedAt: new Date(Date.now() - 3600000 * 36),
  },
];

const initialFeedbacks: MemoryFeedback[] = [
  {
    _id: 'fb_1',
    ticketId: 'CS-2026-10442',
    rating: 5,
    comment: 'The AI provided the exact documentation and the human agent resolved my SSO setup in minutes!',
    customerName: 'Sarah Jenkins',
    createdAt: new Date(Date.now() - 3600000 * 35),
  },
];

class MemoryStore {
  private tickets: MemoryTicket[] = [...initialTickets];
  private conversations: Map<string, MemoryConversation> = new Map();
  private feedbacks: MemoryFeedback[] = [...initialFeedbacks];

  // Ticket Operations
  public async getTickets(filter: Partial<MemoryTicket> = {}): Promise<MemoryTicket[]> {
    return this.tickets
      .filter((t) => {
        for (const key of Object.keys(filter) as Array<keyof MemoryTicket>) {
          if (filter[key] !== undefined && t[key] !== filter[key]) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public async getTicketById(ticketIdOrId: string): Promise<MemoryTicket | null> {
    const ticket = this.tickets.find((t) => t.ticketId === ticketIdOrId || t._id === ticketIdOrId);
    return ticket || null;
  }

  public async createTicket(ticketData: Omit<MemoryTicket, '_id' | 'createdAt' | 'updatedAt'>): Promise<MemoryTicket> {
    const newTicket: MemoryTicket = {
      ...ticketData,
      _id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tickets.unshift(newTicket);
    return newTicket;
  }

  public async updateTicket(
    ticketIdOrId: string,
    updates: Partial<MemoryTicket> & { timelineEntry?: { event: string; performedBy: string; note?: string } }
  ): Promise<MemoryTicket | null> {
    const index = this.tickets.findIndex((t) => t.ticketId === ticketIdOrId || t._id === ticketIdOrId);
    if (index === -1) return null;

    const current = this.tickets[index];
    const { timelineEntry, ...rest } = updates;

    const updatedTimeline = [...current.timeline];
    if (timelineEntry) {
      updatedTimeline.push({
        timestamp: new Date(),
        event: timelineEntry.event,
        performedBy: timelineEntry.performedBy,
        note: timelineEntry.note,
      });
    }

    const updatedTicket: MemoryTicket = {
      ...current,
      ...rest,
      timeline: updatedTimeline,
      updatedAt: new Date(),
    };

    this.tickets[index] = updatedTicket;
    return updatedTicket;
  }

  // Conversation Operations
  public async getConversation(sessionId: string): Promise<MemoryConversation | null> {
    return this.conversations.get(sessionId) || null;
  }

  public async saveMessage(sessionId: string, message: IMessage, customerId: string = 'CUST-DEMO-01'): Promise<MemoryConversation> {
    let convo = this.conversations.get(sessionId);
    if (!convo) {
      convo = {
        _id: 'conv_' + Date.now(),
        sessionId,
        customerId,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.conversations.set(sessionId, convo);
    }
    convo.messages.push(message);
    convo.updatedAt = new Date();
    return convo;
  }

  // Feedback Operations
  public async addFeedback(ticketId: string, rating: number, comment: string, customerName?: string): Promise<MemoryFeedback> {
    const newFeedback: MemoryFeedback = {
      _id: 'fb_' + Date.now(),
      ticketId,
      rating,
      comment,
      customerName: customerName || 'Customer',
      createdAt: new Date(),
    };
    this.feedbacks.unshift(newFeedback);
    return newFeedback;
  }

  public async getFeedbacks(): Promise<MemoryFeedback[]> {
    return [...this.feedbacks];
  }

  // Dashboard Metrics
  public async getDashboardStats() {
    const totalTickets = this.tickets.length;
    const openTickets = this.tickets.filter((t) => t.status === 'Open' || t.status === 'Processing').length;
    const highPriorityTickets = this.tickets.filter((t) => t.priority === 'High' || t.priority === 'Critical').length;
    const resolvedTickets = this.tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length;
    const escalatedTickets = this.tickets.filter(
      (t) => t.escalationStatus === 'Escalated' || t.escalationStatus === 'Human Specialist Assigned'
    ).length;

    const avgRating =
      this.feedbacks.length > 0
        ? Number((this.feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / this.feedbacks.length).toFixed(1))
        : 4.8;

    return {
      totalTickets,
      openTickets,
      highPriorityTickets,
      resolvedTickets,
      escalatedTickets,
      avgRating,
      totalFeedback: this.feedbacks.length,
      recentTickets: this.tickets.slice(0, 10),
      feedbacks: this.feedbacks.slice(0, 5),
    };
  }
}

export const memoryStore = new MemoryStore();
