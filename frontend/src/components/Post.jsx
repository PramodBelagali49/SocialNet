import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogTrigger, DialogContent } from './ui/dialog'
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/Button'
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { setPosts } from '@/redux/postSlice'

function Post({post}) {
    const [text,setText]=useState("");
    const [commentIconClicked,setCommentIconClicked]=useState(false);
    const {user}=useSelector(store=>store.auth);
    const {posts}=useSelector(store=>store.post);
    const dispatch=useDispatch();

    const commentInputHandler=(e)=>{
        const inputText=e.target.value;
        if(inputText.trim()){
            setText(inputText);
        }else{
            setText("");
        }
    }
    const deletePostHandler=async()=>{
        try {
            const res=await axios.delete(`http://localhost:3600/api/posts/${post._id}/deletePost`,{withCredentials:true});
            if(res.data.success){
                const remainingPosts=posts.filter(postItem=>postItem._id !== post._id);
                dispatch(setPosts(remainingPosts));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }

    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={post.author?.profilePicture || null} alt='profile_pic'></AvatarImage>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1 className='font-semibold'>{post.author?.username}</h1>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer'/>
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center">
                        <Button variant="default" className="cursor-pointer w-fit text-[#ED4956] font-bold">Unfollow</Button>
                        <Button variant="default" className="cursor-pointer w-fit  font-bold">Add to favourites</Button>
                        {
                            user?._id===post?.author?._id && <Button onClick={deletePostHandler} variant="default" className="cursor-pointer w-fit  font-bold">Delete</Button>
                        }
                    </DialogContent>
                </Dialog>
            </div>
            <img
                    className='rounded-sm my-2 w-full aspect-square object-cover h-full'
                    src={post.image}
                    alt="post_pic"
            />

            <div className='flex item-center justify-between mb-1'>
                <div className='flex items-center gap-3'>
                    <Heart className='cursor-pointer hover:text-gray-500'/>
                    <MessageCircle onClick={()=>setCommentIconClicked(true)} className='cursor-pointer hover:text-gray-500'/>
                    <Send className='cursor-pointer hover:text-gray-500'/>
                </div>
                <Bookmark className='cursor-pointer hover:text-gray-500'/>
            </div>
            <span className='font-medium block mb-2'>{post.likes.length? post.likes.length+" likes" : "0 like"} </span>
            <p>
                <span className='font-medium mr-2'>{post.author?.username}</span>
                {post.caption}
            </p>
            <span onClick={()=>setCommentIconClicked(true)} className='cursor-pointer text-gray-500'>{post.comments.length? `view all ${post.comments.length} comments ` : "No comments yet"}</span>
            <CommentDialog commentIconClicked={commentIconClicked}  setCommentIconClicked={setCommentIconClicked}/>

            <div className='flex items-center justify-between'>
                <input
                    type="text"
                    placeholder='Add a comment....'
                    className='outline-none text-sm w-full'
                    value={text}
                    onChange={commentInputHandler}
                />
                { text && <span className='text-[#3badf8]'>Post</span> }
            </div>
        </div>
    )
} 

export default Post