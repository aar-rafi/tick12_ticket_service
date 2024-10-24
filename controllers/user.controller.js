import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
// import redisClient from "../redis/redis.client.js";
import {pool} from "../database/pool.js";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_WEB_KEY, { expiresIn: "10d" });
};

// Register user and cache the result
const registerUser = async (req, res) => {
  const { name, password } = req.body;
  console.log(name);

  try {
    if (!name || !password) {
      return res.status(400).send({ error: "All fields are required" });
    }

    // Check if user already exists in the database
    const existQuery = `SELECT * FROM users WHERE name = $1`;
    const existResult = await pool.query(existQuery, [name]);
    if (existResult.rows.length > 0) {
      return res.status(409).send({ error: "Name is already in use" });
    }

    // Hash the password and insert the new user
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const insertUserQuery = `
      INSERT INTO users (name, password) 
      VALUES ($1, $2) 
      RETURNING id, name;
    `;
    const result = await pool.query(insertUserQuery, [name, hashedPassword]);
    const user = result.rows[0];

    const webToken = createToken(user.id);

    // Cache the new user data in Redis
    // await redisClient.set(`user:${user.id}`, JSON.stringify(user), 'EX', 3600); // 1 hour expiration

    return res.status(201).send({ name: user.name, webToken });
  } catch (e) {
    return res.status(500).send({ error: e.message });
  }
};

// Login user and cache the result if not cached
// const loginUser = async (req, res) => {
//   const { name, password } = req.body;

//   if (!name || !password) {
//     return res.status(400).send({ error: "All fields are required" });
//   }

//   try {
//     // Check if user data exists in Redis cache
//     const cachedUser = await redisClient.get(`user:${name}`);
//     let user;

//     if (cachedUser) {
//       // Parse cached user data
//       user = JSON.parse(cachedUser);
//     } else {
//       // Fallback to PostgreSQL if cache miss
//       const query = `SELECT * FROM users WHERE name = $1`;
//       const result = await pool.query(query, [name]);
//       user = result.rows[0];
//       if (!user) {
//         return res.status(404).send({ error: "No such name found" });
//       }

//       // Cache the user data
//       await redisClient.set(`user:${name}`, JSON.stringify(user), 'EX', 3600); // 1 hour expiration
//     }

//     // Validate password
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.status(401).send({ error: "Invalid credentials" });
//     }

//     const webToken = createToken(user.id);
//     return res.status(201).send({ name: user.name, webToken });
//   } catch (e) {
//     return res.status(500).send({ error: e.message });
//   }
// };

// // Get user by ID with Redis caching
// const getUserByID = async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Check Redis cache first
//     const cachedUser = await redisClient.get(`user:${id}`);
//     if (cachedUser) {
//       return res.status(200).send(JSON.parse(cachedUser));
//     }

//     // If not in cache, get user from PostgreSQL
//     const query = `SELECT id, name FROM users WHERE id = $1`;
//     const result = await pool.query(query, [id]);
//     const user = result.rows[0];
//     if (!user) {
//       return res.status(404).send({ error: "No such id found" });
//     }

//     // Cache the user data
//     await redisClient.set(`user:${id}`, JSON.stringify(user), 'EX', 3600); // 1 hour expiration

//     return res.status(200).send(user);
//   } catch (e) {
//     return res.status(500).send({ error: e.message });
//   }
// };

// // Validate user by ID with Redis caching
// const validateUserByID = async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Check Redis cache first
//     const cachedUser = await redisClient.get(`user:${id}`);
//     if (cachedUser) {
//       return res.status(200).send({ user: JSON.parse(cachedUser) });
//     }

//     // If not in cache, get user from PostgreSQL
//     const query = `SELECT id, name FROM users WHERE id = $1`;
//     const result = await pool.query(query, [id]);
//     const user = result.rows[0];
//     if (!user) {
//       return res.status(404).send({ error: "No such id found" });
//     }

//     // Cache the user data
//     await redisClient.set(`user:${id}`, JSON.stringify(user), 'EX', 3600); // 1 hour expiration

//     return res.status(200).send({ user });
//   } catch (e) {
//     return res.status(500).send({ error: e.message });
//   }
// };

// export { registerUser, loginUser, getUserByID, validateUserByID };
export { registerUser };