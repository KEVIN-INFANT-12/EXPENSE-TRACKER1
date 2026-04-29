import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, "secret123");
    req.user = decoded; // ✅ attach user
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}