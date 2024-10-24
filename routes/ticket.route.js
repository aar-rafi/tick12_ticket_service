import express from "express";
import { bookTicket } from "../controllers/ticket.controller.js";
const router = express.Router();

router.post("/book", bookTicket);

export default router;