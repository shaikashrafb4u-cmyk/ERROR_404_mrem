import mongoose, { Schema, Document } from 'mongoose';

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

export interface ITicket extends Document {
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
  timeline: Array<{
    timestamp: Date;
    event: string;
    performedBy: string;
    note?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema: Schema = new Schema(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    customerId: { type: String, required: true, default: 'CUST-DEMO-01' },
    customerName: { type: String, default: 'Alex Mercer' },
    customerEmail: { type: String, default: 'alex.mercer@example.com' },
    category: {
      type: String,
      required: true,
      enum: [
        'Payment Issue',
        'Refund Issue',
        'Order Delay',
        'Wrong Product',
        'Damaged Product',
        'Account/Login Issue',
        'Technical Issue',
        'Delivery Issue',
        'Fraud/Suspicious Transaction',
        'General Inquiry',
      ],
      default: 'General Inquiry',
    },
    priority: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    summary: { type: String, required: true },
    department: { type: String, required: true, default: 'General Support' },
    status: {
      type: String,
      required: true,
      enum: ['Open', 'Processing', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
    },
    escalationStatus: {
      type: String,
      required: true,
      enum: ['None', 'Pending', 'Escalated', 'Human Specialist Assigned'],
      default: 'None',
    },
    recommendedAction: { type: String, default: 'Awaiting initial support review.' },
    extractedEntities: {
      orderId: { type: String },
      transactionId: { type: String },
      amount: { type: String },
      date: { type: String },
      productName: { type: String },
    },
    timeline: [
      {
        timestamp: { type: Date, default: Date.now },
        event: { type: String, required: true },
        performedBy: { type: String, required: true },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const Ticket = mongoose.model<ITicket>('Ticket', TicketSchema);
