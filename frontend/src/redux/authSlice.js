import { createSlice } from "@reduxjs/toolkit";

const authSlice=createSlice({
    name:"auth",
    initialState:{
        user:null,
        suggestedUsers:[],
        userProfile:null,
        selectedUserForChat:null,
    },
    reducers:{
        setAuthUser:(state,action)=>{
            state.user=action.payload
        },
        setSuggestedUsers:(state,action)=>{
            state.suggestedUsers=action.payload
        },
        setUserProfile:(state,action)=>{
            state.userProfile=action.payload
        },
        setSelectedUserForChat:(state,action)=>{
            state.selectedUserForChat=action.payload
        }
    }
});

export const {setAuthUser,setSuggestedUsers,setUserProfile,setSelectedUserForChat}=authSlice.actions
export default authSlice.reducer