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

// Book tickets for multiple seats
const bookTickets = async (req, res) => {
  const { from_station_name, to_station_name, user_id, train_id, seat_numbers } = req.body;

  try {
    if (!from_station_name || !to_station_name || !user_id || !train_id || !seat_numbers || seat_numbers.length === 0) {
      return res.status(400).send({ error: "All fields are required, including seat numbers" });
    }

    // Get station IDs from names
    const [from_station_id, to_station_id] = await Promise.all([
      getStationId(from_station_name),
      getStationId(to_station_name),
    ]);

    console.log(from_station_id, to_station_id);

    const tickets = [];
    const price = 200;

    // Insert tickets for each seat in seat_numbers array
    for (const seat_number of seat_numbers) {
      const ticket_id = uuidv4();
      const insertTicketQuery = `
        INSERT INTO tickets (ticket_id, user_id, train_id, seat_number, price, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING ticket_id, user_id, train_id, seat_number, price, status;
      `;
      const result = await pool.query(insertTicketQuery, [
        ticket_id, user_id, train_id, seat_number, price, 1
      ]);

      tickets.push(result.rows[0]);
    }

    // Return all booked tickets
    return res.status(201).send({
      message: "Tickets booked successfully",
      tickets,
    });

  } catch (e) {
    console.error(e.message);
    const status = e.message.includes("not found") ? 404 : 500;
    return res.status(status).send({ error: e.message || "Failed to book tickets" });
  }
};

export { bookTickets };