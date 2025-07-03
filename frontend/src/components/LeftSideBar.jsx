import { AvatarImage } from '@radix-ui/react-avatar'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, PlusSquareIcon, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { AvatarFallback, Avatar } from './ui/avatar'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser, setSuggestedUsers } from '@/redux/authSlice'
import CreatePost from './ui/createPost'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/Button'
import { setLikeNotifications } from '@/redux/rtnSlice'
// import store from '../redux/store.js/'   // No need bcz useSelector automatically uses the default Store from the Provider in main.jsx

function LeftSideBar() {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    // const user=useSelector(store=>store.auth?.user);
    const {user}=useSelector(store=>store.auth);
    const [createIconClicked,setCreateIconClicked]=useState(false);

    const {likeNotifications}=useSelector(store=>store.realTimeNotification);

    const logoutHandler=async()=>{
        try {
            const res=await axios.get("http://localhost:3600/api/user/logout",{withCredentials:true})
            if(res.data.success){
                dispatch(setAuthUser(null));
                dispatch(setPosts([]));
                dispatch(setSelectedPost(null));
                dispatch(setSuggestedUsers([]));
                navigate("/login")
            }
            toast.success(res.data.message);
        } catch (error) {
            if(!user){
                navigate("/login")
            }
            console.log("galati in logouthandler : ",error);
            toast.error(error?.response?.data?.message);
        }
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
                <Avatar>
                    <AvatarImage src={user?.profilePicture} alt='avatarImage' className='w-full h-full'/>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ),
            text:"Profile"
        },
        { icon:<LogOut/> , text:"Logout" }
    ]

    const sideBarhandler=(textType)=>{
        if (textType=="Logout"){
            logoutHandler();
        }else if (textType=="Create"){
            setCreateIconClicked(true);
        }else if(textType=="Profile"){
            navigate(`/profile/${user?._id}`);
        }else if (textType=="Home"){
            navigate("/");
        }else if (textType=="Messages"){
            navigate("/chat");
        }
    }

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
                                        {
                                            item.text=="Notifications" && likeNotifications.length > 0 && (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button size="icon" className="rounded-full h-5 w-5 absolute bottom-6 left-6 bg-red-600 cursor-pointer">{likeNotifications.length}</Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className='bg-gray-300'>
                                                        <div>
                                                            {
                                                                likeNotifications.length==0 ? (<p>No new notifications</p>) : (
                                                                    likeNotifications.map((notification,index)=>{
                                                                        // console.log("notification.userDetails inside popover",notification);
                                                                        return(
                                                                            <div key={index} className='flex gap-4 items-center my-1' to={`/profile/${notification?.userId}`}>
                                                                                <Avatar>
                                                                                    <AvatarImage src={notification?.profilePicture} className='w-full h-full'></AvatarImage>
                                                                                    <AvatarFallback>CN</AvatarFallback>
                                                                                </Avatar>
                                                                                <p className='text-sm'><span className='font-bold'>{notification?.username}</span> liked your post</p>
                                                                            </div>
                                                                        )
                                                                    })
                                                                )
                                                            }
                                                            <Button onClick={()=>{
                                                                        console.log("setlikenotification working in onclick");
                                                                        dispatch(setLikeNotifications([])); 
                                                                    }
                                                                }
                                                                className="bg-gray-100 h-6 w-30 mt-4 cursor-pointer">Mark as seen
                                                            </Button>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            )
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
            </div>
            <CreatePost createIconClicked={createIconClicked} setCreateIconClicked={setCreateIconClicked}/>
        </div>
    )
}

export default LeftSideBar