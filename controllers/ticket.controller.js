import { v4 as uuidv4 } from 'uuid';
import "dotenv/config.js";
import { pool } from "../database/pool.js";

// Helper function to get station ID from station name
const getStationId = async (station_name) => {
  const query = `SELECT station_id FROM stations WHERE station_name = $1;`;
  const result = await pool.query(query, [station_name]);
  if (result.rows.length === 0) throw new Error(`${station_name} not found`);
  return result.rows[0].station_id;
};

// Book a ticket
const bookTicket = async (req, res) => {
  const { from_station_name, to_station_name, user_id, train_id, seat_number } = req.body;

  try {
    if (!from_station_name || !to_station_name || !user_id || !train_id || !seat_number) {
      return res.status(400).send({ error: "All fields are required" });
    }

    // Get station IDs from names
    const [from_station_id, to_station_id] = await Promise.all([
      getStationId(from_station_name),
      getStationId(to_station_name),
    ]);

    // Insert ticket
    const ticket_id = uuidv4();
    const price = 200;
    const insertTicketQuery = `
      INSERT INTO tickets (ticket_id, train_id, seat_number, user_id, from_station_id, to_station_id, price)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, ticket_id, train_id, seat_number, user_id, from_station_id, to_station_id, price;
    `;
    const result = await pool.query(insertTicketQuery, [
      ticket_id, train_id, seat_number, user_id, from_station_id, to_station_id, price,
    ]);
    const ticket = result.rows[0];

    // Return response
    return res.status(201).send({
      message: "Ticket booked successfully",
      ticket,
    });
  } catch (e) {
    console.error(e.message);
    const status = e.message.includes("not found") ? 404 : 500;
    return res.status(status).send({ error: e.message || "Failed to book ticket" });
  }
};

export { bookTicket };