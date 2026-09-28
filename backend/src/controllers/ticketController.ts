import { Request, Response, NextFunction } from 'express';
import { TicketService } from '../services/ticketService';

export const createTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      category,
      priority,
      title,
      description,
      summary,
      department,
      customerId,
      customerName,
      customerEmail,
      recommendedAction,
      extractedEntities,
      shouldEscalate,
    } = req.body;

    if (!category || !title || !description) {
      res.status(400).json({ success: false, message: 'Category, title, and description are required.' });
      return;
    }

    const ticket = await TicketService.createTicket({
      category,
      priority: priority || 'Medium',
      title,
      description,
      summary: summary || title,
      department,
      customerId,
      customerName,
      customerEmail,
      recommendedAction,
      extractedEntities,
      shouldEscalate,
    });

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully.',
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const getTickets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, priority, status, search } = req.query;

    const tickets = await TicketService.getTickets({
      category: category as string,
      priority: priority as string,
      status: status as string,
      search: search as string,
    });

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    next(error);
  }
};

export const getTicketById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const ticket = await TicketService.getTicketById(id);

    if (!ticket) {
      res.status(404).json({ success: false, message: `Ticket with ID ${id} not found.` });
      return;
    }

    res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { status, department, priority, recommendedAction, performedBy, note } = req.body;

    const updated = await TicketService.updateTicket(id, {
      status,
      department,
      priority,
      recommendedAction,
      performedBy,
      note,
    });

    if (!updated) {
      res.status(404).json({ success: false, message: `Ticket with ID ${id} not found.` });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Ticket updated successfully.',
      ticket: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const escalateTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { reason, department } = req.body;

    const escalated = await TicketService.escalateTicket(id, reason, department);

    if (!escalated) {
      res.status(404).json({ success: false, message: `Ticket with ID ${id} not found.` });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Ticket escalated to human specialist successfully.',
      ticket: escalated,
    });
  } catch (error) {
    next(error);
  }
};
