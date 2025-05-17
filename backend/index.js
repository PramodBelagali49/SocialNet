import dotenv from "dotenv"
if(process.env.NODE_ENV != "production"){
    dotenv.config({ path: '../.env' })
}

import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./utils/connectDB.js"

const app=express()
// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));

const corsOptions={
    origin:"http://localhost:5173",
    credentials:true
}
app.use(cors(corsOptions));


app.get("/",(req,resp)=>{
    return resp.status(200).json({
        message:"I'm from backend",
        success:true
    })
})

const port=8000;
app.listen(port,()=>{
    connectDB();
    console.log(`server listening to port ${port}`);
})
