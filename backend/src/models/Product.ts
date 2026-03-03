import mongoose, { Document, Schema } from "mongoose";

export interface ProductAttrs {
  title: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  category?: string;
  tags?: string[];
  images?: string[];
  stock?: number;
  isFeatured?: boolean;
  isPublished?: boolean;
}

export interface ProductDoc extends Document {
  title: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  category?: string;
  tags: string[];
  images: string[];
  stock: number;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<ProductDoc>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    currency: { type: String, required: true, default: "INR" },
    category: { type: String },
    tags: [{ type: String }],
    images: [{ type: String }],
    stock: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model<ProductDoc>("Product", productSchema);

