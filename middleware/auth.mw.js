import jwt from "jsonwebtoken";
import "dotenv/config.js";

const auth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send("Authorization token not found");
  }

  const token = authorization.split(" ")[1];

  try {
    const { user_id } = jwt.verify(token, process.env.SECRET_WEB_KEY);

    const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:8000"; // Fallback for local dev

    const response = await fetch(`${authServiceUrl}/api/user/validate/${user_id}`);

    if (!response.ok) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    const user = await response.json();
    req.user = user;

    next();
  } catch (e) {
    console.error(e);
    return res.status(401).send({ error: "Unauthorized" });
  }
};

export default auth;