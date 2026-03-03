import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import type { AuthPayload } from "../middleware/auth";

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user || !user.isActive || !user.roles.includes("admin")) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const payload: AuthPayload = {
    userId: user.id,
    roles: user.roles,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
    },
  });
});

