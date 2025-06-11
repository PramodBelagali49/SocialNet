import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSideBar from './LeftSideBar'
import Home from './Home'

function MainLayout() {
  return (
    <div>
        <LeftSideBar/>
        <div>
            <Outlet/>
            <Home/>
        </div>
    </div>
    
  )
}

export default MainLayout