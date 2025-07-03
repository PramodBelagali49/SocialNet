import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogTrigger, DialogContent } from './ui/dialog'
import { Badge, Bookmark, BookmarkCheck, Heart, MessageCircle, MoreHorizontal, Send, FaHeart, FaRegHeart } from 'lucide-react'
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import { BookMarked } from 'lucide-react';

import { Button } from './ui/Button'
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Link } from 'react-router-dom';

function Post({post}) {
    const [text,setText]=useState("");
    const [commentIconClicked,setCommentIconClicked]=useState(false);
    const {user}=useSelector(store=>store.auth);
    const {posts}=useSelector(store=>store.post);
    const dispatch=useDispatch();
    const [liked,setLiked]=useState(post.likes.includes(user?._id));
    const [comments,setComments]=useState(post.comments);
    const [saved,setSaved]=useState("");

    const commentInputHandler=(e)=>{
        const inputText=e.target.value;
        if(inputText.trim()){
            setText(inputText);
        }else{
            setText("");
        }
    }
    
    const commentHandler=async()=>{
        try {
            const res=await axios.post(`http://localhost:3600/api/posts/${post._id}/addComment`,{text},{
                headers:{"Content-Type":"application/json"},
                withCredentials:true
            });

            if(res.data.success){
                // console.log("res.data(comment): ",res.data);
                const updatedComments=[...comments,res.data.comment];
                setComments(updatedComments);
                
                const updatedPost = {
                    ...post,
                    comments: updatedComments
                };

                const updatedPosts=posts.map(p=>
                    p._id === post._id ? updatedPost : p
                )
                dispatch(setPosts(updatedPosts));
                dispatch(setSelectedPost(updatedPost));
                toast.success(res.data.message);
                setText("");
            }

        } catch (error) {
            console.log("galati in commentHandler ",error);
            toast.error(error?.response?.data?.message);
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

    const likeOrDislikeHandler=async()=>{
        try {
            let action = liked ? "unlikePost" : "likePost"
            const res=await axios.patch(`http://localhost:3600/api/posts/${post._id}/${action}`,{},{withCredentials:true});
            if(res.data.success){
                toast.success(res.data.message);
                setLiked(!liked);
                const updatedPosts=posts.map(p=>
                    p._id === post._id ? {
                        ...p,
                        likes : liked ? ( p.likes.filter(uid => uid !==user._id) ) : ( [...p.likes,user._id] )
                    } : p
                )
                dispatch(setPosts(updatedPosts));
            }
        } catch (error) {
            console.log("error in likeDislikeHandler ",error);
            toast.error(error?.response?.data?.message);
        }
    }

    const bookmarkHandler=async()=>{
        try {
            const res=await axios.patch(`http://localhost:3600/api/posts/${post?._id}/bookmarkPost`,{},{withCredentials:true});
            if(res.data.success){
                setSaved(res.data.type);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log("galati in bookmark handdler: ",error);
        }
    }

    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>
                <div>
                    <Link to={`/profile/${post?.author?._id}`} className='flex items-center gap-2'>
                        <Avatar>
                            <AvatarImage src={post.author?.profilePicture || null} alt='profile_pic'></AvatarImage>
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className='flex items-center gap-3'>
                            <h1 className='font-semibold'>{post.author?.username}</h1>
                            {
                                user?._id === post?.author?._id &&
                                <span className="bg-gray-300 font-semibold text-black text-[10px] px-2 py-0.5 rounded-full">
                                        Author
                                </span>
                            }
                        </div>
                    </Link>
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
                    {
                        liked ? <FaHeart onClick={likeOrDislikeHandler} size={'24'} className='cursor-pointer text-red-500' /> : <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer hover:text-gray-600' />
                    }
                    <MessageCircle onClick={ ()=>
                        {setCommentIconClicked(true),dispatch(setSelectedPost({...post,comments:comments}))}
                    } className='cursor-pointer hover:text-gray-500'/>
                    <Send className='cursor-pointer hover:text-gray-500'/>
                </div>

                {
                    saved=="saved" ? (
                        <BookmarkCheck onClick={bookmarkHandler} className="w-6 h-6 fill-current text-blue-500" />
                    ) : (
                        <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-500'/>
                    )
                }
            </div>
            <span className='font-medium block mb-2'>
                {post.likes.length==0 ? "0 likes" : post.likes.length=='1' ? "1 like" : post.likes.length+" likes"}
            </span>
            <p>
                <span className='font-medium mr-2'>{post.author?.username}</span>
                {post.caption}
            </p>
            <span onClick={ ()=>{setCommentIconClicked(true),dispatch(setSelectedPost(post))} } className='cursor-pointer text-gray-500'>{post.comments.length? `view all ${post.comments.length} comments ` : "No comments yet"}</span>
            <CommentDialog commentIconClicked={commentIconClicked}  setCommentIconClicked={setCommentIconClicked}/>

            <div className='flex items-center justify-between'>
                <input
                    type="text"
                    placeholder='Add a comment....'
                    className='outline-none text-md w-full'
                    value={text}
                    onChange={commentInputHandler}
                />
                { text && <Button variant="outline" onClick={commentHandler} className='text-[#3badf8] h-0.5 cursor-pointer'>Post</Button> }
            </div>
        </div>
    )
} 

export default Post