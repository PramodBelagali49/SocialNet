import { AvatarImage } from '@radix-ui/react-avatar'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, PlusSquareIcon, Search, TrendingUp } from 'lucide-react'
import React from 'react'
import { AvatarFallback, Avatar } from './ui/avatar'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
// import store from '../redux/store.js'   // No need bcz useSelector automatically uses the default Store from the Provider in main.jsx

function LeftSideBar() {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {user}=useSelector(store=>store.auth || {})

    const logoutHandler=async()=>{
        try {
            const res=await axios.get("http://localhost:3600/api/user/logout",{withCredentials:true})
            if(res.data.success){
                dispatch(setAuthUser(null));
                navigate("/login")
            }
            toast.success(res.data.message);
        } catch (error) {   
            console.log("galati in logouthandler : ",error);
            toast.error(error?.response?.data?.message);
        }
    }

    const sideBarhandler=(textType)=>{
        if(textType=="Logout") logoutHandler();
    }
    const sidebarItems=[
        {icon:<Home/>,text:"Home"},
        {icon:<Search/>,text:"Search"},
        {icon:<TrendingUp/> , text:"Explore"},
        {icon:<MessageCircle/> , text:"Messages"},
        {icon:<Heart/> , text:"Notifications"},
        {icon:<PlusSquareIcon/> , text:"Create"},
        {
            icon: (
                <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.profilePicture || ""} alt='avatarImage'/>
                    <AvatarFallback/>
                </Avatar>
            ),
            text:"Profile"
        },
        { icon:<LogOut/> , text:"Logout" }
    ]
    return (
        <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[15%] h-screen'>
            <div className='flex flex-col'>
                    <h1 className='my-8 pl-3 font-bold text-xl'>LOGO</h1>
                    <div>
                        {
                            sidebarItems.map((item,index)=>{
                                return (
                                    <div onClick={()=>sideBarhandler(item.text)} key={index} className='flex items-center gap-3 relative hover:bg-gray-200 cursor-pointer rounded-lg p-3 my-3'>
                                        {item.icon}
                                        <span>{item.text}</span> 
                                    </div>
                                )
                            })
                        }
                    </div>
            </div>
        </div>
    )
}

export default LeftSideBar