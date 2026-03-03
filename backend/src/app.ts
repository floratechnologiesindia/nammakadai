import express from "express";
import cors from "cors";
import morgan from "morgan";
import { json } from "body-parser";
import { authRouter } from "./routes/auth";
import { publicProductsRouter } from "./routes/products.public";
import { adminProductsRouter } from "./routes/products.admin";
import { adminUsersRouter } from "./routes/users.admin";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGINS?.split(",") || "*" }));
app.use(json());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/products", publicProductsRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/users", adminUsersRouter);

app.use(errorHandler);

