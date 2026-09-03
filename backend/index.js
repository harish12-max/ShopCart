import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import cors from "cors"


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

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']

}))

app.use("/user" , userRoutes)


app.listen(port ,() =>{
    console.log( "Server started at port 8082");
})