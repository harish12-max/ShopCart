
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import wishListRoutes from "./routes/wishListRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || process.env.port || 8082;

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/wishlist", wishListRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

mongoose
    .connect(process.env.dbUrl)
    .then(() => {
        console.log("DB connected");
    })
    .catch((err) => {
        console.error("DB connection failed:", err);
    });

app.listen(port, "0.0.0.0", () => {
    console.log(`Server started at port ${port}`);
});
