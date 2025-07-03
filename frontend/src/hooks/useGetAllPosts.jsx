import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const useGetAllPosts=()=>{
    const dispatch=useDispatch();
    useEffect(()=>{
        const fetchAllPosts=async()=>{
            try {
                const res=await axios.get("https://socialnet-sfz6.onrender.com/api/posts",{withCredentials:true});
                if(res.data.success){
                    // console.log(res.data.posts);
                    dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllPosts();
    },[])
}
export default useGetAllPosts;
