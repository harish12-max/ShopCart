
import mongoose from "mongoose";
import Product from "../modules/productmodel.js";
import User from "../modules/usermodel.js";

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid Product ID"
            });
        }

        const productExist = await Product.findById(productId);
        if (!productExist) {
            return res.status(404).json({
                message: "Product Not Found"
            });
        }


        const userExist = await User.findById(userId);
        if (!userExist) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        const cartItem = userExist.cart.find(
            (item) => item.product.toString() === productId
        );

        const newQuantity = cartItem
            ? cartItem.quantity + 1
            : 1;

        if (newQuantity > productExist.stock) {
            return res.status(400).json({
                message: "Insufficient Stock"
            });
        }

        if (cartItem) {
            cartItem.quantity = newQuantity;
        } else {
            userExist.cart.push({
                product: productId,
                quantity: 1
            });
        }

        await userExist.save();

        return res.status(200).json({
            message: "Cart Updated Successfully",
            cart: userExist.cart
        });

    } catch (error) {
        console.error("Add to Cart Error:", error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const getCart = async (req, res) => {
    try {
        const userId = req.user._id

        const userExist = await User.findById(userId).populate("cart.product");
        if (!userExist) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        return res.status(200).json({
            message: "Cart fetched successfully",
            cart: userExist.cart
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}


export const updatedCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;
        const { quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid Product ID"
            });
        }


        const userExist = await User.findById(userId);
        if (!userExist) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }


        const productExist = await Product.findById(productId);
        if (!productExist) {
            return res.status(404).json({
                message: "Product Not Found"
            });
        }


        const productExistInCart = userExist.cart.find(
            (item) => item.product.toString() === productId.toString()
        );

        if (!productExistInCart) {
            return res.status(404).json({
                message: "Product Not Found In Cart"
            });
        }

        if (!Number.isInteger(quantity)) {
            return res.status(400).json({
                message: "Quantity must be a number"
            });
        }

        if (quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1"
            });
        }


        if (quantity > productExist.stock) {
            return res.status(400).json({
                message: "Quantity exceeds available stock"
            });
        }


        productExistInCart.quantity = quantity;

        await userExist.save();


        return res.status(200).json({
            message: "Cart quantity updated successfully",
            cart: userExist.cart
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


export const deleteCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid Product ID"
            });
        }

        const userExist = await User.findById(userId);
        if (!userExist) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }


        const productExistInCart = userExist.cart.find((item) => item.product.toString() === productId)
        if (!productExistInCart) {
            return res.status(404).json({
                message: "Product Not Found In Cart"
            });
        }

        userExist.cart = userExist.cart.filter(
            (item) => item.product.toString() !== productId
        );

        await userExist.save();

        return res.status(200).json({
            message: "Product removed from cart successfully",
            cart: userExist.cart
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}