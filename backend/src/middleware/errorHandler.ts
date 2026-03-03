import { NextFunction, Request, Response } from "express";

// Simple centralized error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}

