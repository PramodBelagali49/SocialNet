import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/Button'
import Signup from './components/signup'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Signup></Signup>
      {/* <Button>Hello Bhai</Button> */}
    </>
  )
}

export default App
