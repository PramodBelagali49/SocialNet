import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogTrigger, DialogContent } from './ui/dialog'
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/Button'
import CommentDialog from './CommentDialog'

function Post() {
    const [text,setText]=useState("");
    const [commentIconClicked,setCommentIconClicked]=useState(false);

    const commentInputHandler=(e)=>{
        const inputText=e.target.value;
        if(inputText.trim()){
            setText(inputText);
        }else{
            setText("");
        }
    }

    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src='https://media.istockphoto.com/id/1498459479/photo/shiva-on-mountain-peak.webp?a=1&b=1&s=612x612&w=0&k=20&c=tsXTbzOeTQnh_fFAexhdOi2x-enultdzbd6uBN_RRKk=' alt='profile_pic'></AvatarImage>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1>Username</h1>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer'/>
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center bg-white">
                        <Button variant="ghost" className="cursor-pointer w-fit text-[#ED4956] font-bold">Unfollow</Button>
                        <Button variant="ghost" className="cursor-pointer w-fit  font-bold">Add to favourites</Button>
                        <Button variant="ghost" className="cursor-pointer w-fit  font-bold">Delete</Button>
                    </DialogContent>
                </Dialog>
            </div>
            <img 
                    className='rounded-sm my-2 w-full aspect-sqaure object-cover'
                    src="https://media.istockphoto.com/id/1498459479/photo/shiva-on-mountain-peak.webp?a=1&b=1&s=612x612&w=0&k=20&c=tsXTbzOeTQnh_fFAexhdOi2x-enultdzbd6uBN_RRKk="
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
            <span className='font-medium block mb-2'>1k likes</span>
            <p>
                <span className='font-medium mr-2'>Username</span>
                caption
            </p>
            <span onClick={()=>setCommentIconClicked(true)} className='cursor-pointer text-gray-500'>view all 10 comments</span>
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