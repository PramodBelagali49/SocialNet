import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const SuggestedUsers = () => {
    const { suggestedUsers } = useSelector(store => store.auth);
    const [seeAll,setSeeAll] =useState(false);
    return (
        <div className='my-10 mr-2'>
            <div className='flex items-center justify-between text-sm'>
                <h1 className='font-semibold text-gray-600 mr-2'>Suggested for you</h1>
                {
                seeAll ? 
                    <span className='font-medium cursor-pointer' onClick={()=>setSeeAll(false)}>See less</span>
                    :
                    <span className='font-medium cursor-pointer' onClick={()=>setSeeAll(true)}>See all</span>
                }
            </div>
            {
                seeAll ? 
                    suggestedUsers?.map((user) => {
                        // console.log(user);
                        return (
                            <div key={user._id} className='flex items-center justify-between my-5'>
                                <div className='flex items-center gap-2'>
                                    <Link to={`/profile/${user?._id}`}>
                                        <Avatar>
                                            <AvatarImage src={user?.profilePicture} alt="post_image" />
                                            <AvatarFallback className="w-full h-full">CN</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div>
                                        <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
                                        <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
                                    </div>
                                </div>
                                <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'>Follow</span>
                            </div>
                        )
                    }) : 
                    suggestedUsers?.slice(0,5).map((user) => {
                        // console.log(user);
                        return (
                            <div key={user._id} className='flex items-center justify-between my-5'>
                                <div className='flex items-center gap-2'>
                                    <Link to={`/profile/${user?._id}`}>
                                        <Avatar>
                                            <AvatarImage src={user?.profilePicture} alt="post_image" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div>
                                        <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
                                        <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
                                    </div>
                                </div>
                                <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'>Follow</span>
                            </div>
                        )
                    })
            }
        </div>
    )
}

export default SuggestedUsers