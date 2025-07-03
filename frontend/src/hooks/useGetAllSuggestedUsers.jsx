import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const useGetAllSuggestedUsers=()=>{
    const dispatch=useDispatch();
    useEffect(()=>{
        const fetchSuggestions=async()=>{
            try {
                const res=await axios.get("https://socialnet-sfz6.onrender.com/api/user/suggested",{withCredentials:true});
                if(res.data.success){
                    // console.log(res.data.users);
                    dispatch(setSuggestedUsers(res.data.users));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSuggestions();
    },[])
}
export default useGetAllSuggestedUsers;
