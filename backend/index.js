import dotenv from "dotenv"
if(process.env.NODE_ENV != "production"){
    dotenv.config({ path: '../.env' })
}

import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./utils/connectDB.js"
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"

const app=express()
// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

const corsOptions={
    origin:"http://localhost:5173",
    credentials:true
}
app.use(cors(corsOptions));

// Routes
app.use("/api/user",userRoutes);
app.use("/api/posts",postRoutes);

const port=3600
app.listen(port,()=>{
    connectDB();
    console.log(`server listening to port ${port}`);
})
