import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetAllPosts from '@/hooks/useGetAllPosts'
import { useGetAllSuggestedUsers } from '@/hooks/useGetAllSuggestedUsers'

function Home() {
  useGetAllPosts();
  useGetAllSuggestedUsers();
  return (
    <div className='flex'>
        <div className='flex-grow'>
            <Feed/> 
            <Outlet/> 
        </div>
        <RightSidebar/>
    </div>
  )
}

export default Home