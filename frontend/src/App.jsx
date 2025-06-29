import Signup from './components/signup'
import Login from './components/Login'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Home from './components/Home'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import ChatPage from './components/ChatPage'
import { io } from 'socket.io-client'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

function App() {
  const user=useSelector(store=>store.auth);
  useEffect({
      if(user){
        const socketio=io("http://localhost:3600",{
          query:{
            userId:user?._id
          },
          transports:["websocket"]
        })
      }
  },[])
  const browserRouter=createBrowserRouter([
    {
      path:"/",
      element:<MainLayout/>,
      children:[
        {
          path:"/",
          element:<Home/>
        },
        {
          path:"/profile/:id",
          element:<Profile/>
        },
        {
          path:"/profile/edit",
          element:<EditProfile/>
        },{
          path:"/chat",
          element:<ChatPage/>
        }
      ]
    },
    {
      path:"/signup",
      element:<Signup/>
    },
    {
      path:"/login",
      element:<Login/>
    }
  ])

  return (
    <div>
        <RouterProvider router={browserRouter}/>
    </div>
  )
}

export default App
