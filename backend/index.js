import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app=express()

app.listen(5600,()=>{
    console.log("server listening to port 5600");
})

app.get("/",(req,resp)=>{
    resp.send("Hey bye bye ig!!");
})