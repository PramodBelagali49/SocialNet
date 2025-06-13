import React, { useRef, useState } from 'react'
import { Dialog, DialogHeader, DialogTitle } from './dialog'
import { DialogContent } from './dialog'
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Button } from './Button';
import { fileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

function CreatePost({createIconClicked,setCreateIconClicked}) {
    const [file,setFile]=useState("");
    const [caption,setCaption]=useState("");
    const [imagePreview,setImagePreview]=useState("");
    const [loading,setLoading]=useState(false);
    const {posts}=useSelector(store=>store.post);
    const {user}=useSelector(store=>store.auth);
    const dispatch=useDispatch();

    const fileChangeHandler=async(e)=>{
        let fileInp=e.target.files?.[0];
        if(fileInp){
            setFile(fileInp);
            const dataUrl=await fileAsDataURL(fileInp);
            console.log(dataUrl.slice(0, 100));
            setImagePreview(dataUrl);
        }
    }

    const createPostHandler=async(e)=>{
        let formdata=new FormData();
        formdata.append("caption",caption);
        if(imagePreview) formdata.append("image",file);
        try {
            setLoading(true);
            const res=await axios.post("http://localhost:3600/api/posts",formdata,{
                headers:{
                    "Content-Type":"multipart/form-data"
                },
                withCredentials:true
            });
            if(res.data.success){
                dispatch(setPosts([res.data.post,...posts]));
                toast.success(res.data.message);
                setCreateIconClicked(false);
                setCaption("");
                setFile("");
                setImagePreview("");
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
        } finally{
            setLoading(false);
        }
    }
    const imageRef=useRef();
    return (
    <Dialog open={createIconClicked}>
        <DialogContent onInteractOutside={()=>setCreateIconClicked(false)}>
            <DialogHeader className="text-center font-semibold mx-auto">Create new post</DialogHeader>
            <div className='flex items-center gap-3'>
                <Avatar>
                    <AvatarImage src={user?.profilePicture} alt="avatar_img"></AvatarImage>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className='font-semibold text-lg'>{user?.username}</h1>
                    <span className='text-gray-600 text-xs'>Bio here...</span>
                </div>
            </div>
            <textarea value={caption} onChange={(e)=>setCaption(e.target.value)} placeholder='Add a caption...' className="focus:outline-none focus:border-none focus:ring-0 border-none"></textarea>
            {
                imagePreview && (
                    <div className='w-full h-64 flex items-center justify-center'>
                        <img src={imagePreview} alt="preview_img" className='w-full h-full object-cover rounded-md'/>
                    </div>
                )
            }
            <input ref={imageRef} type="file" className='hidden' onChange={fileChangeHandler}/>
            <Button onClick={()=>imageRef.current.click()} className='w-fit mx-auto bg-[#0095f6] hover:bg-[#66c1f6]'>Select file from the device</Button>
            {
                imagePreview && (
                    loading ? (
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                            Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full bg-green-800 text-white" onClick={createPostHandler}>
                            Post
                        </Button>
                    )
                )
            }
        </DialogContent>
    </Dialog>
  )
}

export default CreatePost