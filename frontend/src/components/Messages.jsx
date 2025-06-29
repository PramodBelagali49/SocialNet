import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { Button } from './ui/Button'

function Messages({selectedUserForChat}) {
  return (
    <div className='overflow-y-auto flex-1 p-4'>
        <div className='flex justify-center'>
            <div className='flex flex-col items-center justify-center'>
                <Avatar className="h-20 w-20">
                    <AvatarImage
                    src={selectedUserForChat?.profilePicture}
                    alt="profilephoto"
                    />
                    <AvatarFallback className="w-[150px] h-[150px] flex items-center justify-center bg-gray-200"></AvatarFallback>
                </Avatar>
                <span>{selectedUserForChat?.username}</span>
                <Link to={`/profile/${selectedUserForChat?._id}`}><Button className="h-8 my-2" variant="secondary">View profile</Button></Link>
            </div>
        </div>
    </div>
  )
}

export default Messages