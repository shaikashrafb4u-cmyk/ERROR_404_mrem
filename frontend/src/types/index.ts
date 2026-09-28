export type TicketCategory =
  | 'Payment Issue'
  | 'Refund Issue'
  | 'Order Delay'
  | 'Wrong Product'
  | 'Damaged Product'
  | 'Account/Login Issue'
  | 'Technical Issue'
  | 'Delivery Issue'
  | 'Fraud/Suspicious Transaction'
  | 'General Inquiry';

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type TicketStatus = 'Open' | 'Processing' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';

export type EscalationStatus = 'None' | 'Pending' | 'Escalated' | 'Human Specialist Assigned';

export interface TimelineEntry {
  timestamp: string | Date;
  event: string;
  performedBy: string;
  note?: string;
}

export interface Ticket {
  _id: string;
  ticketId: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
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
  timeline: TimelineEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface StructuredAIAnalysis {
  intent: string;
  category: TicketCategory;
  priority: TicketPriority;
  summary: string;
  requiredAction: string;
  department: string;
  shouldCreateTicket: boolean;
  shouldEscalate: boolean;
  extractedEntities?: {
    orderId?: string;
    transactionId?: string;
    amount?: string;
    date?: string;
    productName?: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'ai' | 'agent' | 'system';
  text: string;
  timestamp: string | Date;
  analysis?: StructuredAIAnalysis;
  ticket?: Ticket;
}

export interface Feedback {
  _id?: string;
  ticketId: string;
  rating: number;
  comment: string;
  customerName?: string;
  createdAt?: string;
}

export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  highPriorityTickets: number;
  resolvedTickets: number;
  escalatedTickets: number;
  avgRating: number;
  totalFeedback: number;
  recentTickets: Ticket[];
  feedbacks: Feedback[];
}
