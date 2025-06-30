import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage=async(req,resp)=>{
    try {
        const senderId=req.id;
        const receiverId=req.params.id;
        const message=(req.body)?.message;
        
        let conversation=await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        });

        if(!conversation){
            conversation=await Conversation.create({
                participants:[senderId,receiverId],
                message
            })
        }

        const newMessage=await Message.create({
            senderId,
            receiverId,
            message
        })
        if(conversation) conversation.messages.push(newMessage._id);
        await Promise.all([conversation.save(),newMessage.save()]);

        const receiverSocketId=getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        return resp.status(201).json({
            newMessage,
            success:true
        })
    } catch (error) {
        console.log("Error in sendMessage",error);
    }
}

export const getMessage=async(req,resp)=>{
    try {
        const senderId=req.id;
        const receiverId=req.params.id;
        
        let conversation=await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        });
        if(conversation){
            await conversation.populate("messages");
        }else{
            return resp.status(200).json({success:true,messages:[]});
        }
        return resp.status(200).json({success:true,messages:conversation?.messages});

    } catch (error) {
        console.log("Error in getMessage: ",error);
    }
}