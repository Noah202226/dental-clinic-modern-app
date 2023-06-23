import Login from './components/Login'
import Home from './components/Home'
import { useState } from 'react'

function App() {
  const [isLogin, setIsLogin] = useState(false)

  return isLogin ? <Home /> : <Login setIsLogin={setIsLogin} />
}

export default App
