import mongoose from "mongoose";
import product from "../modules/productmodel.js";
import User from "../modules/usermodel.js";



export const addToWishList = async (req, res) => {
    try {
        const { productId } = req.params
        const userId = req.user._id

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User Not Found" })
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid Product Id" })
        }

        const productExist = await product.findById(productId)
        if (!productExist) {
            return res.status(404).json({ message: "Product Not Found" })
        }

        const productExistInList = user.wishList.some(id => id.toString() === productId.toString())

        if (productExistInList) {
            return res.status(409).json({ message: "Product already exists in wishlist" })
        }

        const wishList = await User.findByIdAndUpdate(req.user._id,
            { $addToSet: { wishList: productId } }, { new: true })

        return res.status(201).json({ message: "Successfully added to wishList", wishList })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error " })
    }


}


export const getUserWishList = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("wishList")

        if (!user) {
            return res.status(404).json({ message: "User Not Found" })
        }

        return res.status(200).json({
            success: true,
            wishList: user.wishList
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })

    }
}





export const removeToWishList = async (req, res) => {
    try {
        const { productId } = req.params
        const userId = req.user._id

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User Not Found" })
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid Product Id" })
        }

        const productExistInList = user.wishList.some(id => id.toString() === productId.toString())

        if (!productExistInList) {
            return res.status(404).json({ message: "Product not exists in wishlist" })
        }

        const wishList = await User.findByIdAndUpdate(req.user._id,
            { $pull: { wishList: productId } }, { new: true })

        return res.status(200).json({ message: "Successfully removed from wishList", wishList })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error " })
    }


}