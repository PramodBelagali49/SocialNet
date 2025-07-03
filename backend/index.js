import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from 'url';

// ✅ Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env only in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./utils/connectDB.js"
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import { app, server } from "./socket/socket.js"


// const app=express()
const port=3600

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
app.use("/api/messages",messageRoutes);

app.use(express.static(path.join(__dirname,"frontend","dist")));
app.get("/*path",(req,resp)=>{
    resp.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
})

server.listen(port,()=>{
    connectDB();
    console.log(`server listening to port ${port}`);
})
