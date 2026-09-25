import express from "express";
import {
    productregister,
    getAllProduct,
    getProductById,
    searchProduct
} from "../controllers/productRegister.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import upload from "../middleware/upload.js";

const productRoutes = express.Router();

productRoutes.use(isAuthenticated);

productRoutes.post(
    "/products",
    (req, res, next) => {
        upload.single("image")(req, res, (error) => {
            if (error) {
                return res.status(400).json({
                    message: error.message
                });
            }

            next();
        });
    },
    productregister
);

productRoutes.get("/products", getAllProduct);
productRoutes.get("/products/:id", getProductById);
productRoutes.get("/search", searchProduct);

export default productRoutes;
