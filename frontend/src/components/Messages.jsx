import React, { useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { Button } from './ui/Button'
import { useSelector } from 'react-redux'
import useGetAllMessages from '@/hooks/useGetAllMessages'
import useGetRTM from '@/hooks/useGetRTM'

function Messages({selectedUserForChat}) {
    useGetRTM();
    useGetAllMessages();
    const {messages}=useSelector(store=>store.chat);
    const {user}=useSelector(store=>store.auth);
    return (
      <div className='overflow-y-auto flex-1 p-4'>
          <div className='flex justify-center flex-col'>
              <div className='flex flex-col items-center justify-center'>
                  <Avatar className="h-20 w-20">
                      <AvatarImage
                      src={selectedUserForChat?.profilePicture}
                      alt="profilephoto"
                      />
                      <AvatarFallback className="w-[150px] h-[150px] flex items-center justify-center bg-gray-200"></AvatarFallback>
                  </Avatar>
                  <span>{selectedUserForChat?.username}</span>
                  <Link to={`/profile/${selectedUserForChat?._id}`}><Button className="h-8 my-2 cursor-pointer bg-gray-300" variant="secondary">View profile</Button></Link>
              </div>
              <div>
                {
                  messages && messages.map((message)=>{
                    return(
                          <div className={`flex ${user?._id==message.senderId ? 'justify-end' : 'justify-start'}`} key={message?._id}>
                              <div className={`p-2 rounded-lg max-w-xs break-words ${message.senderId === user?._id ? 'bg-blue-500 text-white my-1' : 'bg-gray-200 text-black my-2'}`}>
                                  {message.message}
                              </div>
                          </div>
                    )
                  })
                }
              </div>
          </div>
      </div>
    )
}

export default Messages