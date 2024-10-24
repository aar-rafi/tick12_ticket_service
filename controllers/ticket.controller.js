/* eslint-disable no-unused-vars */
import { v4 as uuidv4 } from 'uuid'; // Import for generating unique ticket_id
import "dotenv/config.js";
import { pool } from "../database/pool.js";

// Book a ticket
const bookTicket = async (req, res) => {
  const { from_station_id, to_station_id, user_id, train_id, seat_number } = req.body;

  try {
    // Validate the request payload
    if (!from_station_id || !to_station_id || !user_id || !train_id || !seat_number) {
      return res.status(400).send({ error: "All fields are required" });
    }

    // Generate a unique ticket_id using UUID
    const ticket_id = uuidv4();
    const price = 200;

    // Insert the new ticket into the tickets table
    const insertTicketQuery = `
      INSERT INTO tickets (ticket_id, train_id, seat_number, user_id, price)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, ticket_id, train_id, seat_number, user_id, price;
    `;
    const result = await pool.query(insertTicketQuery, [ticket_id, train_id, seat_number, user_id, price]);
    const ticket = result.rows[0];

    // Send the response back with the newly created ticket
    return res.status(201).send({
      message: "Ticket booked successfully",
      ticket: {
        id: ticket.id,
        ticket_id: ticket.ticket_id,
        train_id: ticket.train_id,
        seat_number: ticket.seat_number,
        user_id: ticket.user_id,
        price: ticket.price,
      },
    });
  } catch (e) {
    console.error(e.message);
    return res.status(500).send({ error: "Failed to book ticket. Please try again later." });
  }
};

export { bookTicket };