import express from "express"
import { addToWishList, getUserWishList, removeToWishList } from "../controllers/wishList.js"
import { isAuthenticated } from "../middleware/isAuthenticated.js"


const wishListRoutes = express.Router()


wishListRoutes.use(isAuthenticated)
wishListRoutes.post("/:productId", addToWishList)
wishListRoutes.get("/" , getUserWishList)
wishListRoutes.delete("/:productId",removeToWishList)


export default wishListRoutes;