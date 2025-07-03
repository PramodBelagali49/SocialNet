import { createSlice } from "@reduxjs/toolkit";

const rtnSlice=createSlice({
    name:"realTimeNotification",
    initialState:{
        likeNotifications:[]
    },
    reducers:{
        // actions
        setLikeNotifications:(state,action)=>{
            if (Array.isArray(action.payload)) {
                state.likeNotifications = action.payload;
            }else if(action.payload.type=="like"){
                state.likeNotifications.push(action.payload.userDetails);
            }else if(action.payload.type=="dislike"){
                state.likeNotifications=state.likeNotifications.filter((item)=>item.userId !== action.payload.userId)
            }
        }
    }
})
export const {setLikeNotifications}=rtnSlice.actions
export default rtnSlice.reducer