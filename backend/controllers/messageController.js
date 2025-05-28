import Conversation from "../models/conversation";
import Message from "../models/message";

export const sendMessage=async(req,resp)=>{
    try {
        const senderId=req.id;
        const receiverId=req.params.id;
        const message=req.body.message;
        
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

        return resp.status(201).json({
            newMessage,
            success:true
        })
    } catch (error) {
        console.log("Error in sendMessage",error);
    }
} 