import { useSocket } from "@/context/socketContext";
import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useGetRTM=()=>{
    const dispatch=useDispatch();
    const socket=useSocket();
    const {messages}=useSelector(store=>store.chat);

    useEffect(()=>{
        socket?.on("newMessage",(newMessage)=>{
            dispatch(setMessages([...messages,newMessage]));
        })

        return()=>{
            socket?.off();
        }
    },[messages,setMessages])

}
export default useGetRTM;