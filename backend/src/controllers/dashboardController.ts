import { Request, Response, NextFunction } from 'express';
import { TicketService } from '../services/ticketService';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await TicketService.getDashboardStats();
    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};
