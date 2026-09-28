import { Ticket, DashboardStats, StructuredAIAnalysis, Feedback } from '../types';

const API_BASE = '/api';

export interface ChatResponse {
  success: boolean;
  sessionId: string;
  reply: string;
  analysis: StructuredAIAnalysis;
  ticket: Ticket | null;
}

export class ApiService {
  /**
   * Sends customer message to AI complaint intelligence backend
   */
  public static async sendChatMessage(
    message: string,
    sessionId: string,
    history: Array<{ sender: string; text: string }> = []
  ): Promise<ChatResponse> {
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sessionId, history }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      console.error('[API Error in sendChatMessage]:', error);
      throw new Error('Unable to connect to support services. Please check backend connection.');
    }
  }

  /**
   * Fetches ticket list with optional filters
   */
  public static async getTickets(filters: {
    category?: string;
    priority?: string;
    status?: string;
    search?: string;
  } = {}): Promise<Ticket[]> {
    try {
      const params = new URLSearchParams();
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.priority && filters.priority !== 'All') params.append('priority', filters.priority);
      if (filters.status && filters.status !== 'All') params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const url = `${API_BASE}/tickets${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.tickets || [];
    } catch (error) {
      console.error('[API Error in getTickets]:', error);
      throw new Error('Unable to retrieve tickets from support services.');
    }
  }

  /**
   * Fetches a single ticket by ticket ID
   */
  public static async getTicketById(id: string): Promise<Ticket> {
    try {
      const res = await fetch(`${API_BASE}/tickets/${id}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.ticket;
    } catch (error) {
      console.error('[API Error in getTicketById]:', error);
      throw new Error(`Unable to fetch ticket ${id}.`);
    }
  }

  /**
   * Updates ticket status, department, or priority
   */
  public static async updateTicket(
    id: string,
    updates: {
      status?: string;
      department?: string;
      priority?: string;
      performedBy?: string;
      note?: string;
    }
  ): Promise<Ticket> {
    try {
      const res = await fetch(`${API_BASE}/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.ticket;
    } catch (error) {
      console.error('[API Error in updateTicket]:', error);
      throw new Error('Failed to update ticket status.');
    }
  }

  /**
   * Escalates a ticket to human specialist
   */
  public static async escalateTicket(id: string, reason?: string, department?: string): Promise<Ticket> {
    try {
      const res = await fetch(`${API_BASE}/tickets/${id}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, department }),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.ticket;
    } catch (error) {
      console.error('[API Error in escalateTicket]:', error);
      throw new Error('Failed to escalate ticket to human specialist.');
    }
  }

  /**
   * Submits customer satisfaction rating & feedback
   */
  public static async submitFeedback(
    ticketId: string,
    rating: number,
    comment: string,
    customerName?: string
  ): Promise<Feedback> {
    try {
      const res = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, rating, comment, customerName }),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.feedback;
    } catch (error) {
      console.error('[API Error in submitFeedback]:', error);
      throw new Error('Unable to submit feedback.');
    }
  }

  /**
   * Fetches dashboard statistics & analytics
   */
  public static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const res = await fetch(`${API_BASE}/dashboard/stats`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.stats;
    } catch (error) {
      console.error('[API Error in getDashboardStats]:', error);
      throw new Error('Unable to fetch dashboard metrics.');
    }
  }
}
