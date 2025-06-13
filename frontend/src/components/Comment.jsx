import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

function Comment({comment}) {
  return (
    <div className='my-2'>
        <div className='flex gap-1 items-center'>
            <Avatar>
                <AvatarImage src={comment?.author?.profilePicture} alt="pfp"></AvatarImage>
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className='font-semibold text-sm'>{comment?.author?.username}
                <span className='font-normal pl-3'>{comment?.text}</span>
            </h1>
        </div>
    </div>
  )
}

export default Comment