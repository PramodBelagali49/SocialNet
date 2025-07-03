import {Server} from "socket.io";
import express from "express";
import http from "http";
const app=express();

const server=http.createServer(app);

const io=new Server(server,{
    cors:{
        origin:process.env.URL,
        methods:["GET","POST"]
    }
})

const userSocketMap={};

export const getReceiverSocketId=(receiverId)=>userSocketMap[receiverId];

io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId]=socket.id;
        // console.log(`userId:${userId} connected to socketID:${socket.id}`);
    }

    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        if(userId){
            // console.log(`userId:${userId} disConnected from socketId:${socket.id}`);
            delete userSocketMap[userId];
        }
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
})

export {app,server,io};

