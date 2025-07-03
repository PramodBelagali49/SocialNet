import Signup from './components/Signup'
import Login from './components/Login'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Home from './components/Home'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import ChatPage from './components/ChatPage'
import { io } from 'socket.io-client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { SocketContext } from './context/socketContext.js'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotifications } from './redux/rtnSlice'
import ProtectedRoutes from './components/ProtectedRoutes'

function App() {
    const {user}=useSelector(store=>store.auth);
    const dispatch=useDispatch();
    const [socket, setSocket] = useState(null);
    useEffect(()=>{
      let socketio;
      if(user){
          socketio=io("https://socialnet-sfz6.onrender.com",{
            query:{
              userId:user?._id
            },
            transports:["websocket"]
          })
          
          setSocket(socketio);

          socketio.on("getOnlineUsers",(onlineUsers)=>{
            dispatch(setOnlineUsers(onlineUsers));
          })

          socketio.on("notification",(notification)=>{
            dispatch(setLikeNotifications(notification));
          })

          return () => {
            socketio?.disconnect();
            setSocket(null);
          };
      }else{
            socketio?.disconnect();
            setSocket(null);
      }
  },[user,dispatch])
  const browserRouter=createBrowserRouter([
    {
      path:"/",
      element:<ProtectedRoutes><MainLayout/></ProtectedRoutes>,
      children:[
        {
          path:"/",
          element:<ProtectedRoutes><Home/></ProtectedRoutes>
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
      <SocketContext.Provider value={socket}>
          <RouterProvider router={browserRouter}/>
      </SocketContext.Provider>
    </div>
  )
}

export default App
