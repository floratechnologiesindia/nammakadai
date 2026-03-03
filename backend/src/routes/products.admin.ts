import { Router, Request, Response } from "express";
import { Product } from "../models/Product";
import { requireAuth, requireRole } from "../middleware/auth";

export const adminProductsRouter = Router();

adminProductsRouter.use(requireAuth, requireRole("admin"));

adminProductsRouter.get("/", async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "20",
    category,
    search,
    published,
  } = req.query as {
    page?: string;
    limit?: string;
    category?: string;
    search?: string;
    published?: string;
  };

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;

  const filter: Record<string, unknown> = {};

  if (category) {
    filter.category = category;
  }

  if (published === "true") {
    filter.isPublished = true;
  } else if (published === "false") {
    filter.isPublished = false;
  }

  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [{ title: regex }, { description: regex }, { category: regex }, { tags: regex }];
  }

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.json({
    items,
    page: pageNum,
    limit: limitNum,
    total,
    totalPages: Math.ceil(total / limitNum),
  });
});

adminProductsRouter.post("/", async (req: Request, res: Response) => {
  const {
    title,
    slug,
    description,
    price,
    currency,
    category,
    tags,
    images,
    stock,
    isFeatured,
    isPublished,
  } = req.body;

  if (!title || !slug || typeof price !== "number" || !currency) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const existing = await Product.findOne({ slug });
  if (existing) {
    return res.status(409).json({ message: "Slug already in use" });
  }

  const product = await Product.create({
    title,
    slug,
    description,
    price,
    currency,
    category,
    tags,
    images,
    stock,
    isFeatured,
    isPublished,
  });

  res.status(201).json(product);
});

adminProductsRouter.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

adminProductsRouter.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await Product.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(204).send();
});

