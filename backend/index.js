import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";
import dotenv from "dotenv"


dotenv.config()

const app = express();
const port = 8082;

app.use(express.json())
app.use(cookieParser())


mongoose.connect(process.env.dbUrl).then(()=>{
    console.log("DB connected")
}).catch((err) =>{
    console.log(err)
})

app.use("/user" , userRoutes)


app.listen(port ,() =>{
    console.log( "Server started at port 8082");
})