import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useGetAllMessages=()=>{
    const dispatch=useDispatch();
    const {selectedUserForChat}=useSelector(store=>store.auth);
    useEffect(()=>{
        const fetchAllMessages=async()=>{
            try {
                const res=await axios.get(`http://localhost:3600/api/messages/all/${selectedUserForChat?._id}`,{withCredentials:true});
                if(res.data.success){
                    // console.log(res.data.messages);
                    dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllMessages();
    },[selectedUserForChat])
}
export default useGetAllMessages;
