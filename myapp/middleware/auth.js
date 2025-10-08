
import { verifyToken } from "../utils/jwt.js";

export function httpAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Missing Bearer token" });
    req.user = verifyToken(token); // { id, username }
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Pour Socket.IO
export function socketAuth(socket, next) {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Missing token"));
    socket.user = verifyToken(token); // { id, username }
    next();
  } catch {
    next(new Error("Invalid or expired token"));
  }
}
