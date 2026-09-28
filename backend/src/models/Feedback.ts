import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  ticketId: string;
  rating: number; // 1 to 5
  comment: string;
  customerName?: string;
  createdAt: Date;
}

const FeedbackSchema: Schema = new Schema(
  {
    ticketId: { type: String, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
    customerName: { type: String, default: 'Customer' },
  },
  { timestamps: true }
);

export const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);
