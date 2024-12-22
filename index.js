/* eslint-disable no-unused-vars */
import app from "./app.js";
const PORT = 8001;

app.listen(PORT, (req, res) => {
  console.log(`Ticket Service server is running at http://localhost:${PORT}`);
});