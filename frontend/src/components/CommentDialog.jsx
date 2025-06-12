import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/Button'

function CommentDialog({commentIconClicked,setCommentIconClicked}) {
  const [text,setText]=useState("");
  
  const changeEventHandler=(e)=>{
    const inputText=e.target.value;
    if(inputText.trim()){
      setText(inputText);
    }else{
      setText("");
    }
  }

  const sendMessageHandler=async()=>{
    alert(text)
  }

  return (
    <Dialog open={commentIconClicked}>
      <DialogContent onInteractOutside={()=>setCommentIconClicked(false)} className='max-w-5xl p-0 flex flex-col h-200% w-200%'>
        <div className='flex flex-1'>
          <div className="w-1/2">
              <img 
                src="https://media.istockphoto.com/id/1498459479/photo/shiva-on-mountain-peak.webp?a=1&b=1&s=612x612&w=0&k=20&c=tsXTbzOeTQnh_fFAexhdOi2x-enultdzbd6uBN_RRKk="
                alt="post_pic"
                className='h-full object-cover rounded-l-lg'
              />
          </div>
            <div className='w-1/2 flex flex-col justify-between'>
              <div className='flex items-center justify-between p-4 pb-2'>
                <div className='flex items-center gap-3'>
                  <Link>
                      <Avatar>
                        <AvatarImage className='' src='https://media.istockphoto.com/id/1498459479/photo/shiva-on-mountain-peak.webp?a=1&b=1&s=612x612&w=0&k=20&c=tsXTbzOeTQnh_fFAexhdOi2x-enultdzbd6uBN_RRKk='/>
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                  </Link>
                  <div>
                    <Link className='font-semibold text-xs'>Username</Link>
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
                  All Comments <br />
                  All Comments
              </div>
              <div className='p-4'>
                <div className='flex items-center gap-2'>
                  <input type="text" value={text} onChange={changeEventHandler} placeholder='Add a comment...' className='w-full outline-none border border-gray-300 p-2 rounded'/>
                  <Button disabled={!text.trim()} onClick={sendMessageHandler} variant='outline'>Send</Button>
                </div>
              </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>    
  )
}

export default CommentDialog