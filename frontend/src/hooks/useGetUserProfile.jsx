import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const useGetUserProfile=(userId)=>{
    const dispatch=useDispatch();
    useEffect(()=>{
        const fetchUserProfile=async()=>{
            try {
                const res=await axios.get(`https://socialnet-sfz6.onrender.com/api/user/${userId}/profile`,{withCredentials:true});
                if(res.data.success){
                    // console.log(res.data.user);
                    dispatch(setUserProfile(res.data.user));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserProfile();
    },[userId])
}
export default useGetUserProfile;