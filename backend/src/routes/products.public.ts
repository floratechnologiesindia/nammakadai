import { Router, Request, Response } from "express";
import { Product } from "../models/Product";

export const publicProductsRouter = Router();

publicProductsRouter.get("/", async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "12",
    category,
    search,
    minPrice,
    maxPrice,
    featured,
  } = req.query as {
    page?: string;
    limit?: string;
    category?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    featured?: string;
  };

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 12;

  const filter: Record<string, unknown> = {
    isPublished: true,
  };

  if (category) {
    filter.category = category;
  }

  if (featured === "true") {
    filter.isFeatured = true;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) {
      (filter.price as Record<string, number>).$gte = Number(minPrice);
    }
    if (maxPrice) {
      (filter.price as Record<string, number>).$lte = Number(maxPrice);
    }
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

publicProductsRouter.get("/:slug", async (req: Request, res: Response) => {
  const { slug } = req.params;
  const product = await Product.findOne({ slug, isPublished: true });
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

