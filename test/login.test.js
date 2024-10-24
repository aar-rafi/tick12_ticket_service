import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import { mongodbURL } from "../config.js";

describe("API Endpoint Tests", () => {
  beforeAll(async () => {
    // Connect to MongoDB before running the tests
    await mongoose.connect(mongodbURL, { dbName: "dfsa" });
  });

  const postLoginRequest = (userData) => request(app).post("/api/user/login").send(userData);

  it("should return success message for POST /api/user/login with valid credentials", async () => {
    const validUser = {
      name: "Jon Snow",
      password: "jon",
    };

    const response = await postLoginRequest(validUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("name", validUser.name);
    expect(response.body).toHaveProperty("webToken");
  });

  it("should return 400 error for POST /api/user/login with missing fields", async () => {
    const invalidUser = {
      name: "Jon Snow",
      // Password is missing
    };

    const response = await postLoginRequest(invalidUser);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "All fields are required");
  });

  it("should return 404 error for POST /api/user/login with invalid username", async () => {
    const invalidUser = {
      name: "NonExistentUser",
      password: "password123",
    };

    const response = await postLoginRequest(invalidUser);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error", "No such name found");
  });

  it("should return 401 error for POST /api/user/login with invalid password", async () => {
    const invalidUser = {
      name: "Jon Snow",
      password: "wrongpassword",
    };

    const response = await postLoginRequest(invalidUser);

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("error", "Invalid credentials");
  });

  afterAll(async () => {
    // Clean up and close MongoDB connection
    try {
      // await User.deleteOne({ name: "Jon Snow" });
    } catch (err) {
      console.log(err);
    } finally {
      await mongoose.connection.close();
    }
  });
});