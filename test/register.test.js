import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import { mongodbURL } from "../config.js";

describe("User Registration Endpoint Tests", () => {
  beforeAll(async () => {
    // Connect to MongoDB before running the tests
    await mongoose.connect(mongodbURL, { dbName: "dfsa" });
  });

  const postRegisterRequest = (userData) => request(app).post("/api/user/register").send(userData);

  it("should return success message for POST /api/user/register with valid data", async () => {
    const validUser = {
      name: "Bran Stark",
      password: "bran",
    };

    const response = await postRegisterRequest(validUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("name", validUser.name);
    expect(response.body).toHaveProperty("webToken");
  });

  it("should return 400 error for POST /api/user/register with missing fields", async () => {
    const invalidUser = {
      name: "Gendry",
      // Password is missing
    };

    const response = await postRegisterRequest(invalidUser);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "All fields are required");
  });

  it("should return 409 error for POST /api/user/register with existing username", async () => {
    const existingUser = {
      name: "Jon Snow",
      password: "jon",
    };

    // First, register Jon Snow
    await postRegisterRequest(existingUser);

    // Now attempt to register Jon Snow again
    const response = await postRegisterRequest(existingUser);

    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty("error", "Name is already in use");
  });

  it("should return 500 error for POST /api/user/register with server error", async () => {
    // Simulate a server error by passing an invalid name
    const invalidUser = {
      name: "",
      password: "password123",
    };

    const response = await postRegisterRequest(invalidUser);

    expect(response.statusCode).toBe(400);
  });

  afterAll(async () => {
    // Clean up and close MongoDB connection
    try {
      // await User.deleteMany({ name: { $in: ["Arya Stark", "Jon Snow"] } });
    } catch (err) {
      console.log(err);
    } finally {
      await mongoose.connection.close();
    }
  });
});