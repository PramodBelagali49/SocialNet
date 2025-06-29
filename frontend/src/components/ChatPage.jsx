import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedUserForChat } from '@/redux/authSlice';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/Button';
import { MessageCircleCode } from 'lucide-react';
import Messages from './Messages';


function ChatPage() {
    const {user, suggestedUsers, selectedUserForChat}=useSelector(store=>store.auth);
    const isOnline=false;
    const dispatch=useDispatch();
  return (
    <div className='flex h-screen'>
        <section className='w-full md:w-1/4 ml-60'>
            <h1 className='font-bold mb-4 px-3 text-xl'>{user?.username}</h1>
            <h4 className='font-semibold ml-2'>Select a user to chat</h4>
            <hr className='mb-4 border-gray-300 w-70'/>
            <div className='overflow-y-auto h-[80vh] w-70'>
                {
                    suggestedUsers.map((suggestedUser) => {
                        // const isOnline = onlineUsers.includes(suggestedUser?._id);
                        return (
                            <div key={suggestedUser?._id} onClick={() => dispatch(setSelectedUserForChat(suggestedUser))} className='flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer'>
                                <Avatar className='w-12 h-12'>
                                    <AvatarImage src={suggestedUser?.profilePicture} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className='flex flex-col'>
                                    <span className='font-medium'>{suggestedUser?.username}</span>
                                    <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'} `}>{isOnline ? 'online' : 'offline'}</span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </section>
        {
            selectedUserForChat ? (
                <section className='flex-1 border-1 border-1-gray-300 flex flex-col h-full mt-2 mr-10 mb-2'>
                    <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10'>
                        <Avatar>
                            <AvatarImage src={selectedUserForChat?.profilePicture}  alt="profilephoto" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                            <span>{selectedUserForChat?.username}</span>
                        </div>
                    </div>
                    {/* Messages */}
                    <Messages selectedUserForChat={selectedUserForChat}/>
                    <div className='flex items-center p-4 border-t border-t-gray-300'>
                        <input
                            type="text"
                            className="flex-1 mr-2 h-9 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 placeholder:text-sm px-2 rounded"
                            placeholder="message something"
                        />

                        <Button variant="outline">Send</Button>
                    </div>
                    <h3><div onClick={()=>dispatch(setSelectedUserForChat(null))} className='cursor-pointer'>Unselect the user</div></h3>
                </section>
            ) : (
                <div className='flex flex-col items-center justify-center mx-auto'>
                    <MessageCircleCode className='w-32 h-32 my-4'/>
                    <h1 className='font-medium text-xl'>Your messages</h1>
                    <span>Send a message to start the conversation</span>
                </div>
            )
        }
    </div>
  )
}
export default ChatPage