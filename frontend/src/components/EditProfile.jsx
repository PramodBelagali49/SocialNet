import React, { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { Textarea } from './ui/textarea';
import { Button } from './ui/Button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setAuthUser, setUserProfile } from '@/redux/authSlice';
import { toast } from 'sonner';

function EditProfile() {
    const imageRef=useRef();
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {user}=useSelector(store=>store.auth);
    const [loading,setLoading]=useState(false);

    const [input,setInput]=useState({
        profilePicture:user?.profilePicture,
        gender:user?.gender,
        bio:user?.bio
    })

    const fileChangeHandler=(e)=>{
        const file=e.target.files?.[0];
        if(file){
            setInput({...input,profilePicture:file})
        }
    }

    const editProfileHandler=async()=>{
        const formData=new FormData();
        if(input?.bio !== undefined && input?.bio !== "") {
            formData.append("bio", input.bio);
        }
        if(input?.gender !== undefined && input?.gender !== "") {
            formData.append("gender", input.gender);
        }
        if(input.profilePicture && input.profilePicture !== user?.profilePicture){
            formData.append("profilePicture", input.profilePicture);
        }
        try {
            setLoading(true);
            const res=await axios.post("https://socialnet-sfz6.onrender.com/api/user/profile/edit",formData,{
                headers:{
                    "Content-Type":"multipart/form-data"
                },
                withCredentials:true
            });
            if(res.data.success){
                console.log("res.data: " ,res.data);
                toast.success(res.data.message);
                const updatedUser={
                    ...user,
                    bio:res.data.user?.bio,
                    gender:res.data.user?.gender,
                    profilePicture:res.data.user?.profilePicture,
                }
                dispatch(setAuthUser(updatedUser));
                dispatch(setUserProfile(updatedUser));
                navigate(`/profile/${user?._id}`);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        } finally{
            setLoading(false);
        }
    }

    return (
        <div className='flex max-w-2xl mx-auto pl-10 my-8'>
            <section className='flex flex-col gap-6 w-full'>
                <h1 className='font-bold text-xl'>Edit Profile</h1>
                <div className='flex items-center justify-between bg-gray-100 rounded-xl p-4'>
                    <div className='flex items-center gap-3'>
                        <Avatar>
                            <AvatarImage src={user?.profilePicture} alt="profile_img"></AvatarImage>
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className='font-bold text-sm'>{user?.username}</h1>
                            <span className='text-gray-600'>{user?.bio || "bio here..."}</span>
                        </div>
                    </div>
                    <input ref={imageRef} onChange={fileChangeHandler} type="file" className='hidden'/>
                    <Button onClick={()=>imageRef.current.click()} className="bg-[#0095f6] h-8 hover:bg-[#84c2eb]">Change photo</Button>
                </div>
                <div>
                    <h1 className='font-bold text-xl mb-2'>Bio</h1>
                    <Textarea value={input?.bio} name="bio" className="focus-visible:ring-transparent"
                        onChange={(e)=>setInput({...input,bio:e.target.value})}
                    />
                </div>
                <div>
                    <h1 className='font-bold text-xl mb-2'>Gender</h1>
                    <Select defaultValue={input?.gender}
                        onValueChange={(value)=>setInput({...input,gender:value})}
                    >
                        <SelectTrigger className="w-full focus-visible:ring-transparent">
                            <SelectValue placeholder="Select your gender"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="male">male</SelectItem>
                                <SelectItem value="female">female</SelectItem>
                                <SelectItem value="prefer not say">prefer not say</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex text-center mt-[100px] mx-auto'>
                    {
                        loading ? (
                            <Button className='w-60 bg-[#0095f6] h-8 hover:bg-[#83b5d7]'>
                                <Loader2 className='mr-1 h-4 w-4 animate-spin'/>
                                Please wait
                            </Button>
                        ) : (
                            <Button onClick={editProfileHandler} className='w-60 bg-[#0095f6] h-8 hover:bg-[#84c2eb]'>Submit</Button>
                        )
                    }
                </div>
            </section>
        </div>
    )
}

export default EditProfile