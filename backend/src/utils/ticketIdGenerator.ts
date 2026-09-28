let sequenceCounter = 10482;

/**
 * Generates a unique, standardized Ticket ID such as CS-2026-10482
 */
export const generateTicketId = (): string => {
  const currentYear = new Date().getFullYear();
  sequenceCounter += Math.floor(Math.random() * 3) + 1;
  return `CS-${currentYear}-${sequenceCounter}`;
};
