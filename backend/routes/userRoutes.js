import express from "express"
import { userRegister,userLogin ,getUser, logoutUser  } from "../controllers/userRegister.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const userRoutes = express.Router()

userRoutes.post("/signup" , userRegister)
userRoutes.post("/login" , userLogin)
userRoutes.get("/me", isAuthenticated ,getUser )
userRoutes.post("/logout" , logoutUser)




export default userRoutes;