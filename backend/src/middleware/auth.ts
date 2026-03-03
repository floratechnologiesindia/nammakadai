import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../models/User";

export interface AuthPayload {
  userId: string;
  roles: UserRole[];
}

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.authUser = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function requireRole(role: UserRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.authUser;
    if (!user || !user.roles.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

