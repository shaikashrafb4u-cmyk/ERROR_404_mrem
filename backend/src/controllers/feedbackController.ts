import { Request, Response, NextFunction } from 'express';
import { TicketService } from '../services/ticketService';

export const submitFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ticketId, rating, comment, customerName } = req.body;

    if (!ticketId || !rating) {
      res.status(400).json({ success: false, message: 'Ticket ID and rating are required.' });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
      return;
    }

    const feedback = await TicketService.addFeedback(ticketId, rating, comment || '', customerName);

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback!',
      feedback,
    });
  } catch (error) {
    next(error);
  }
};
