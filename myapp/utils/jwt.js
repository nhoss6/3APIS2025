 
import jwt from "jsonwebtoken";

export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "dev_secret", { expiresIn: "2h" });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
}
