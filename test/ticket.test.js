import request from "supertest";
import { pool } from "../database/pool.js"; // PostgreSQL connection pool

let client;

describe("API Endpoint Tests for Booking Tickets", () => {
  beforeAll(async () => {
    client = await pool.connect();
    console.log("Connected to PostgreSQL pool");
  }, 15000); // Set timeout to 15 seconds

  const apiURL = "https://services.district12.xyz/ticket"; // Adjust URL as necessary

  // Utility function for booking tickets
  const postBookTicketsRequest = (ticketData) =>
    request(apiURL).post("/api/ticket/book").send(ticketData);

  it("should return success message for POST /api/tickets/book with valid data", async () => {
    const validTicketData = {
      from_station_name: "Station A", // Replace with valid station name
      to_station_name: "Station B", // Replace with valid station name
      user_id: "user-123", // Replace with valid user ID
      train_id: "train-456", // Replace with valid train ID
      seat_numbers: ["A1", "A2"], // Replace with valid seat numbers
    };

    const response = await postBookTicketsRequest(validTicketData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message", "Tickets booked successfully");
    expect(response.body).toHaveProperty("tickets");
    expect(response.body.tickets.length).toBe(validTicketData.seat_numbers.length);
  });

  it("should return 400 error for POST /api/tickets/book with missing fields", async () => {
    const invalidTicketData = {
      from_station_name: "Station A", // Missing other fields
    };

    const response = await postBookTicketsRequest(invalidTicketData);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "All fields are required, including seat numbers");
  });

  it("should return 404 error for POST /api/tickets/book with invalid station name", async () => {
    const invalidTicketData = {
      from_station_name: "Invalid Station", // Non-existent station
      to_station_name: "Station B",
      user_id: "user-123",
      train_id: "train-456",
      seat_numbers: ["A1"],
    };

    const response = await postBookTicketsRequest(invalidTicketData);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error", "Invalid Station not found");
  });

  afterAll(async () => {
    try {
      // Optionally clear Redis cache if needed
    } catch (err) {
      console.error("Error cleaning Redis cache:", err);
    } finally {
      if (client) {
        client.release(); // Release the client back to the pool
      }
      await pool.end(); // Close PostgreSQL connection pool
    }
  }, 15000); // Set timeout to 15 seconds
});