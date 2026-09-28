import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  id: string;
  sender: 'customer' | 'ai' | 'agent' | 'system';
  text: string;
  timestamp: Date;
  structuredData?: {
    intent?: string;
    category?: string;
    priority?: string;
    summary?: string;
    requiredAction?: string;
    ticketId?: string;
    shouldCreateTicket?: boolean;
    shouldEscalate?: boolean;
  };
}

export interface IConversation extends Document {
  sessionId: string;
  customerId: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema({
  id: { type: String, required: true },
  sender: { type: String, required: true, enum: ['customer', 'ai', 'agent', 'system'] },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  structuredData: {
    intent: { type: String },
    category: { type: String },
    priority: { type: String },
    summary: { type: String },
    requiredAction: { type: String },
    ticketId: { type: String },
    shouldCreateTicket: { type: Boolean },
    shouldEscalate: { type: Boolean },
  },
});

const ConversationSchema: Schema = new Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    customerId: { type: String, required: true, default: 'CUST-DEMO-01' },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
