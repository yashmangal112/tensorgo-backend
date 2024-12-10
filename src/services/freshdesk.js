const Freshdesk = require("freshdesk-api");

const freshdesk = new Freshdesk(process.env.FRESHDESK_BASE_URL, process.env.FRESHDESK_API_KEY);

/**
 * Create a Freshdesk ticket for a customer query.
 * @param {Object} ticketData - Data for the ticket (e.g., name, email, subject, description).
 * @returns {Promise} The Freshdesk ticket creation result.
 */
async function createTicket({ name, email, subject, description }) {
  try {
    console.log("Creating Freshdesk ticket...");
    const ticket = await freshdesk.createTicket({
      name,
      email,
      subject,
      description,
      status: 2, // Open
      priority: 1, // Low
    });
    return ticket;
  } catch (error) {
    console.error("Error creating Freshdesk ticket:", error);
    throw new Error("Failed to create Freshdesk ticket");
  }
}

module.exports = { createTicket };
