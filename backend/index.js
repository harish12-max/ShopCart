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
const port = process.env.PORT || 8082;

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        // Allow server-to-server and local health checks without an Origin header.
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    });
});

app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/wishlist", wishListRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

app.use((error, _req, res, _next) => {
    // Avoid returning internal stack traces or provider details to clients.
    console.error("Unhandled request error:", error.message);
    if (error.message === "Origin is not allowed by CORS") {
        return res.status(403).json({ message: "Request origin is not allowed" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
});

const startServer = async () => {
    if (!process.env.dbUrl) {
        throw new Error("Missing required environment variable: dbUrl");
    }

    await mongoose.connect(process.env.dbUrl);
    console.log("DB connected");

    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
};

startServer().catch((error) => {
    console.error("Server startup failed:", error.message);
    process.exit(1);
});
