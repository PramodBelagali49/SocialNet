import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/Button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import axios from 'axios'
import { toast } from 'sonner'

function CommentDialog({commentIconClicked,setCommentIconClicked}) {
  const [text,setText]=useState("");
  const {user}=useSelector(store=>store.auth);
  const {selectedPost,posts}=useSelector(store=>store.post);
  const [comments,setComments]=useState(selectedPost?.comments);
  const dispatch=useDispatch();

  useEffect(()=>{
    if(selectedPost){
      setComments(selectedPost.comments);
    }
  },[selectedPost])

  const changeEventHandler=(e)=>{
    const inputText=e.target.value;
    if(inputText.trim()){
      setText(inputText);
    }else{
      setText("");
    }
  }

  const commentHandler=async()=>{
        try {
            const res=await axios.post(`http://localhost:3600/api/posts/${selectedPost._id}/addComment`,{text},{
                headers:{"Content-Type":"application/json"},
                withCredentials:true
            });

            if(res.data.success){
                // console.log("res.data(comment): ",res.data);
                const updatedComments=[...comments,res.data.comment];
                setComments(updatedComments);
                const updatedPosts=posts.map(p=>
                    p._id === selectedPost._id ? {
                        ...p , comments : updatedComments
                    } : p
                )
                dispatch(setPosts(updatedPosts));
                toast.success(res.data.message);
                setText("");
            }

        } catch (error) {
            console.log("galati in commentHandler ",error);
            toast.error(error?.response?.data?.message);
        }
    }

  return (
    <Dialog open={commentIconClicked}>
      <DialogContent onInteractOutside={()=>{ setCommentIconClicked(false) }} className='max-w-5xl p-0 flex flex-col h-200% w-200%'>
        <div className='flex flex-1'>
          <div className="w-1/2">
              <img 
                src={selectedPost?.image}
                alt="post_pic"
                className='h-full object-cover rounded-l-lg'
              />
          </div>
            <div className='w-1/2 flex flex-col justify-between'>
              <div className='flex items-center justify-between p-4 pb-2'>
                <div className='flex items-center gap-3'>
                  <Link>
                      <Avatar>
                        <AvatarImage className='' src={selectedPost?.author?.profilePicture}></AvatarImage>
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                  </Link>
                  <div>
                    <Link className='font-semibold text-xs'>{selectedPost?.author?.username}</Link>
                  </div>
                </div>
                  <Dialog>
                      <DialogTrigger asChild>
                          <MoreHorizontal className='cursor-pointer'/>
                      </DialogTrigger>
                      <DialogContent className='flex flex-col items-center text-sm text-center bg-white sm:max-w-sm'>
                          <Button className='cursor-pointer w-3/4 text-[#ed4956] font-bold '>Unfollow</Button>
                          <Button className='font-bold cursor-pointer w-3/4'>Add to favourites</Button>
                      </DialogContent>
                  </Dialog>
              </div>
              <hr/>
              <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                    {
                      selectedPost?.comments?.map(comment=><Comment comment={comment}/>)
                    }
              </div>
              <div className='p-4'>
                <div className='flex items-center gap-2'>
                  <input type="text" value={text} onChange={changeEventHandler} placeholder='Add a comment...' className='w-full outline-none border border-gray-300 p-2 rounded'/>
                  <Button disabled={!text.trim()} onClick={commentHandler} variant='outline' className="cursor-pointer">Send</Button>
                </div>
              </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>    
  )
}

export default CommentDialog