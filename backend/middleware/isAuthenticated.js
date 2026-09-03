import jwt from "jsonwebtoken"
import User from "../modules/usermodel.js"

export const isAuthenticated = async(req , res , next)=>{
    try {
     const token = req.cookies.token

     if(!token){
        res.status(401).json({message:"Token Not Found"})
     }

   const decoded = jwt.verify(token , process.env.gen_secret)
   const user = await User.findById(decoded.userId)
    
   if(!user){
     res.status(400).json({message:"User Not Found"})
   }

   req.user = user
   next()    
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
        
    }
}