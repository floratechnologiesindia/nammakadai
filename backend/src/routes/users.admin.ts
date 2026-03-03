import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { requireAuth, requireRole } from "../middleware/auth";

export const adminUsersRouter = Router();

adminUsersRouter.use(requireAuth, requireRole("admin"));

adminUsersRouter.get("/", async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "20",
    role,
    search,
    isActive,
  } = req.query as {
    page?: string;
    limit?: string;
    role?: string;
    search?: string;
    isActive?: string;
  };

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;

  const filter: Record<string, unknown> = {};

  if (role) {
    filter.roles = role;
  }

  if (isActive === "true") {
    filter.isActive = true;
  } else if (isActive === "false") {
    filter.isActive = false;
  }

  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [{ email: regex }, { name: regex }];
  }

  const [items, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .select("-passwordHash"),
    User.countDocuments(filter),
  ]);

  res.json({
    items,
    page: pageNum,
    limit: limitNum,
    total,
    totalPages: Math.ceil(total / limitNum),
  });
});

adminUsersRouter.post("/", async (req: Request, res: Response) => {
  const { email, name, roles, password, isActive } = req.body as {
    email?: string;
    name?: string;
    roles?: string[];
    password?: string;
    isActive?: boolean;
  };

  if (!email || !roles || !Array.isArray(roles) || roles.length === 0) {
    return res.status(400).json({ message: "Email and at least one role are required" });
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({ message: "Email already in use" });
  }

  let passwordHash = "";
  if (password && password.length >= 6) {
    passwordHash = await bcrypt.hash(password, 10);
  } else {
    // For simplicity, require password for new users in v1
    return res.status(400).json({ message: "Password of at least 6 characters is required" });
  }

  const user = await User.create({
    email: email.toLowerCase().trim(),
    name,
    roles,
    passwordHash,
    isActive: isActive ?? true,
  });

  const { passwordHash: _ignored, ...safeUser } = user.toObject();
  res.status(201).json(safeUser);
});

adminUsersRouter.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, roles, isActive, password } = req.body as {
    name?: string;
    roles?: string[];
    isActive?: boolean;
    password?: string;
  };

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (roles && (!Array.isArray(roles) || roles.length === 0)) {
    return res.status(400).json({ message: "Roles must be a non-empty array" });
  }

  const isCurrentlyActiveAdmin = user.isActive && user.roles.includes("admin");
  const willBeAdmin = roles ? roles.includes("admin") : user.roles.includes("admin");
  const willBeActive = isActive !== undefined ? isActive : user.isActive;

  if (
    isCurrentlyActiveAdmin &&
    (!willBeAdmin || !willBeActive)
  ) {
    const otherActiveAdmins = await User.countDocuments({
      _id: { $ne: user._id },
      roles: "admin",
      isActive: true,
    });
    if (otherActiveAdmins === 0) {
      return res.status(400).json({ message: "Cannot remove the last active admin" });
    }
  }

  if (name !== undefined) user.name = name;
  if (roles !== undefined) user.roles = roles as ("admin" | "customer")[];
  if (isActive !== undefined) user.isActive = isActive;

  if (password) {
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    user.passwordHash = await bcrypt.hash(password, 10);
  }

  await user.save();

  const { passwordHash: _ignored, ...safeUser } = user.toObject();
  res.json(safeUser);
});

adminUsersRouter.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.isActive && user.roles.includes("admin")) {
    const otherActiveAdmins = await User.countDocuments({
      _id: { $ne: user._id },
      roles: "admin",
      isActive: true,
    });
    if (otherActiveAdmins === 0) {
      return res.status(400).json({ message: "Cannot delete the last active admin" });
    }
  }

  await user.deleteOne();
  res.status(204).send();
});

