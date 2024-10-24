import express from "express";
import { bookTickets } from "../controllers/ticket.controller.js";
import auth from "../middleware/auth.mw.js";
const router = express.Router();

router.post("/book", auth, bookTickets);

export default router;